from api.models import Token as VerbozeToken
from deployment_manager.models import RemoteDeploymentMachine, Repository, DeploymentTarget, Firmware, Deployment, RunningDeployment
from deployment_manager.serializers import RepositorySerializer, RunningDeploymentSerializer
from channels import Channel, Group
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model

from raven.contrib.django.models import get_client
client = get_client()

import json

def get_valid_token(token):
    # delete old tokens
    VerbozeToken.objects.filter(~Q(expiry=None), expiry__lt=timezone.now()).delete()

    try:
        token_object = VerbozeToken.objects.get(id=token)
    except (VerbozeToken.DoesNotExist, ValidationError):
        return None
    return token_object

def get_rdm_from_token(token):
    if token and isinstance(token.content_object, get_user_model()):
        try:
            return RemoteDeploymentMachine.objects.get(user=token.content_object)
        except:
            return None
    return None

def send_repo_data(message):
    repos = Repository.objects.all()
    serializer = RepositorySerializer(repos, many=True)
    message.reply_channel.send({"text": json.dumps({"repos": serializer.data})})

def send_updated_running_deployments():
    running_deployments = RunningDeployment.objects.all().order_by("-id")
    serializer = RunningDeploymentSerializer(running_deployments, many=True)
    Group("updates_from_rdms").send({"text": json.dumps({"running_deployments": serializer.data})})

def update_rdm_deployment_targets(rdm, message_content):
    deployment_targets = message_content["deployment_targets"]
    if type(deployment_targets) == list: # validate right format

        # delete old deployment targets
        rdm.targets.all().delete()

        for target in deployment_targets:
            new_target_identifier = target.get("identifier")
            new_target_status = target.get("status")
            if new_target_identifier and new_target_status: # validate identifier/status provided
                DeploymentTarget.objects.create(
                    remote_deployment_machine=rdm,
                    identifier=new_target_identifier,
                    status=new_target_status
                )

def update_rdm_firmwares(rdm, message_content):
    firmwares = message_content["firmwares"]
    if type(firmwares) == list: # validate right format

        # delete old firmwares
        rdm.firmwares.all().delete()

        for firmware in firmwares:
            new_firmware_name = firmware.get("name")
            if new_firmware_name: # validate name provided
                Firmware.objects.create(
                    remote_deployment_machine=rdm,
                    name=new_firmware_name
                )

def update_running_deployment_target_stdout(rdm, message_content):
    deployment_id = message_content["deployment_update"].get("deployment")
    updated_stdout = message_content["deployment_update"].get("message")
    updated_status = message_content["deployment_update"].get("status")
    if deployment_id and (updated_stdout or updated_status): # validate right format
        try:
            # atomic block will attempt to make changes, if it fails it will roll back
            with transaction.atomic():
                # `select_for_update` is used to lock rows until end of transaction,
                # to avoid race condition when messages coming in too fast
                deployment = Deployment.objects.select_for_update().filter(id=deployment_id).first()
                running_deployment = deployment.running_deployments.first()
                if updated_stdout:
                    running_deployment.stdout += updated_stdout
                if updated_status and running_deployment.status.lower() != 'error':
                    running_deployment.status = updated_status
                running_deployment.save()
        except Exception as e:
            print(e)
            pass

@client.capture_exceptions
def ws_connect(message, token, deployment_manager=None):
    token_object = get_valid_token(token)
    rdm = get_rdm_from_token(token_object)

    # making sure RDM object exists for token
    if not deployment_manager and rdm:
        message.reply_channel.send({"accept": True})

        # send repo information for client to clone/pull latest
        send_repo_data(message)

        # save channel name to be able to communicate with
        rdm.channel_name = message.reply_channel
        rdm.save()
    elif token_object and isinstance(token_object.content_object, get_user_model()):
        # only accept connections from superusers
        if token_object.content_object.is_superuser:
            message.reply_channel.send({"accept": True})

            # create Channel Group for updates to be sent
            Group("updates_from_rdms").add(message.reply_channel)
            send_updated_running_deployments()

        else:
            message.reply_channel.send({"accept": False})
    else:
        message.reply_channel.send({"accept": False})

@client.capture_exceptions
def ws_receive(message, token, deployment_manager=None):
    token_object = get_valid_token(token)
    message_text = message.content.get("text")
    rdm = get_rdm_from_token(token_object)
    if not deployment_manager and rdm and message_text:
        message_content = json.loads(message_text)
        # Perform logic when receiving data from RDM
        if message_content.get("deployment_targets"):
            update_rdm_deployment_targets(rdm, message_content)
        elif message_content.get("firmwares"):
            update_rdm_firmwares(rdm, message_content)
        elif message_content.get("deployment_update"):
            update_running_deployment_target_stdout(rdm, message_content)
            send_updated_running_deployments()
        else: # ignore message if not any of the above
            pass
    else:
        message.reply_channel.send({"close": True})

@client.capture_exceptions
def ws_disconnect(message, token, deployment_manager=None):
    token_object = get_valid_token(token)
    if token_object:
        if deployment_manager:
            # disconnecting from deployment manager frontend
            Group("updates_from_rdms").discard(message.reply_channel)
        else:
            # disconnecting from RDM
            rdm = get_rdm_from_token(token_object)
            if rdm:
                rdm.delete()

        token_object.delete()
