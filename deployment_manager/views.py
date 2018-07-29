from deployment_manager.models import *
from rest_framework.decorators import list_route, detail_route
from deployment_manager.serializers import *

from deployment_manager.viewsets import DeploymentManagerModelViewSet
from deployment_manager.permissions import IsSuperUser
from deployment_manager.consumers import send_updated_running_deployments
from rest_framework.authentication import SessionAuthentication

from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import render, HttpResponse
from django.db import transaction
from verboze.decorators import superuser_only

import threading, os, re
import subprocess
import json
from os import listdir


@superuser_only(next='/deployment/')
def home_view(req):
    return render(req, 'home.html', {})

class RepositoryViewSet(DeploymentManagerModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

class RepositoryBuildOptionViewSet(DeploymentManagerModelViewSet):
    queryset = RepositoryBuildOption.objects.all()
    serializer_class = RepositoryBuildOptionSerializer

class DeploymentConfigViewSet(DeploymentManagerModelViewSet):
    queryset = DeploymentConfig.objects.all()
    serializer_class = DeploymentConfigSerializer

    @detail_route(methods=['post'], authentication_classes=[SessionAuthentication], permission_classes=[IsSuperUser])
    def new_version(self, request, pk=None):
        config = self.get_object()
        try:
            with transaction.atomic():
                self.clone_new_version(config, config.parent)
        except Exception as e:
            print (e)
            return Response(data={'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['post'], authentication_classes=[], permission_classes=[IsSuperUser])
    def update_parent(self, request, pk=None):
        config = self.get_object()
        try:
            config.parent = sorted(DeploymentConfig.objects.filter(name=config.parent.name), key=lambda dc: -dc.version)[0]
            config.save()
        except Exception as e:
            print (e)
            return Response(data={'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

    def clone_new_version(self, config, parent):
        if config == None:
            return None

        assert(not config.can_be_changed())

        # copy the config itself (with +1 version number)
        new_config = DeploymentConfig.objects.create(parent=parent, name=config.name, version=config.version+1)
        # copy deployment repositories
        repos = DeploymentRepository.objects.filter(deployment=config)
        for R in repos:
            DeploymentRepository.objects.create(repo=R.repo, commit=R.commit, deployment=new_config)
        # copy deployment files
        files = DeploymentFile.objects.filter(deployment=config)
        for F in files:
            new_F = DeploymentFile.objects.create(target_filename=F.target_filename, file_contents=F.file_contents, is_executable=F.is_executable, deployment=new_config)
            # copy deployment file defaults
            file_params = FileDefaultParameter.objects.filter(file=F)
            for FP in file_params:
                FileDefaultParameter.objects.create(is_required=FP.is_required, parameter_name=FP.parameter_name, parameter_value=FP.parameter_value, file=new_F)

        # make all children point to the new versions if they are editable
        # otherwise, recursively copy the children that can't be edited
        children = DeploymentConfig.objects.filter(parent=config)
        # remove old versions
        seen_child_version = {}
        for c in children:
            if c.name not in seen_child_version or seen_child_version[c.name].version < c.version:
                seen_child_version[c.name] = c

        for c in seen_child_version.values():
            if c.can_be_changed():
                c.parent = new_config
                c.save()
            else:
                self.clone_new_version(c, new_config)

        return new_config

class DeploymentFileViewSet(DeploymentManagerModelViewSet):
    queryset = DeploymentFile.objects.all()
    serializer_class = DeploymentFileSerializer

class FileDefaultParameterViewSet(DeploymentManagerModelViewSet):
    queryset = FileDefaultParameter.objects.all()
    serializer_class = FileDefaultParameterSerializer

class DeploymentRepositoryViewSet(DeploymentManagerModelViewSet):
    queryset = DeploymentRepository.objects.all()
    serializer_class = DeploymentRepositorySerializer

class DeploymentViewSet(DeploymentManagerModelViewSet):
    queryset = Deployment.objects.all()
    serializer_class = DeploymentSerializer

    def find_all_repositories(self, base=None):
        if base == None:
            return []
        repos = list(DeploymentRepository.objects.filter(deployment=base))
        my_repos = dict(map(lambda r: (r.repo, r), repos))
        parentRepos = self.find_all_repositories(base=base.parent)
        for r in parentRepos:
            if r.repo not in my_repos:
                repos.append(r)
        return repos

    def find_all_files(self, base=None):
        if base == None:
            return []
        files = list(DeploymentFile.objects.filter(deployment=base))
        my_files = dict(map(lambda f: (f.target_filename, f), files))
        parentFiles = self.find_all_files(base=base.parent)
        for f in parentFiles:
            if f.target_filename not in my_files:
                files.append(f)
        return files

    @list_route(methods=['post'], authentication_classes=[SessionAuthentication], permission_classes=[IsSuperUser])
    def deploy(self, request, pk=None):
        data = request.data
        try:
            with transaction.atomic():
                try:
                    firmware = Firmware.objects.get(pk=data["firmwareId"])
                except:
                    firmware = None
                config = DeploymentConfig.objects.get(pk=data["config"])
                dep = Deployment.objects.create(config=config, target=data["targetName"], comment=data["comment"])
                params = []
                for p in data["params"]:
                    params.append(DeploymentParameter.objects.create(deployment=dep, parameter_name=p["parameter_name"], parameter_value=p["parameter_value"]))
                options = []
                for oid in data["optionIds"]:
                    repo_build_option = RepositoryBuildOption.objects.get(pk=oid)
                    options.append(repo_build_option)
                    DeploymentBuildOption.objects.create(
                        deployment=dep,
                        option_name=repo_build_option.option_name,
                        option_command=repo_build_option.option_command,
                        option_priority=repo_build_option.option_priority
                    )
                disabled_repo_ids = data.get("disabledRepoIds", [])

                deployment_lock = RunningDeployment.objects.create(deployment=dep)

                deployment_target = DeploymentTarget.objects.get(id=data["deploymentTargetId"])

                deployment_repositories = self.find_all_repositories(base=config)
                deployment_files = self.find_all_files(base=config)

                deployment_data = {
                    'deployment_lock': RunningDeploymentSerializer(deployment_lock).data,
                    'deployment_target': DeploymentTargetSerializer(deployment_target).data,
                    'firmware': FirmwareSerializer(firmware).data,
                    'config': DeploymentConfigSerializer(config).data,
                    'dep': DeploymentSerializer(dep).data,
                    'params': DeploymentParameterSerializer(params, many=True).data,
                    'options': RepositoryBuildOptionSerializer(options, many=True).data,
                    'disabled_repo_ids': disabled_repo_ids,
                    'repositories': DeploymentRepositoryForRDMSerializer(deployment_repositories, many=True).data,
                    'files': DeploymentFileSerializer(deployment_files, many=True).data
                }
                deploy_object = {'deploy': deployment_data}
                deployment_target.remote_deployment_machine.ws_send_message({'text': json.dumps(deploy_object)})

                # DeploymentThread(deployment_lock, disk_path, firmware, config, dep, params, options, disabled_repo_ids).start()
        except Exception as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

class DeploymentParameterViewSet(DeploymentManagerModelViewSet):
    queryset = DeploymentParameter.objects.all()
    serializer_class = DeploymentParameterSerializer

class DeploymentBuildOptionViewSet(DeploymentManagerModelViewSet):
    queryset = DeploymentBuildOption.objects.all()
    serializer_class = DeploymentBuildOptionSerializer

class RunningDeploymentViewSet(DeploymentManagerModelViewSet):
    queryset = RunningDeployment.objects.all()
    serializer_class = RunningDeploymentSerializer

    # informing all clients over websockets that a running deployment was deleted
    # so they can update their frontends accordingly
    def destroy(self, request, *args, **kwargs):
        returned = super(DeploymentManagerModelViewSet, self).destroy(request, *args, **kwargs)
        send_updated_running_deployments()
        return returned

class RemoteDeploymentMachineViewSet(DeploymentManagerModelViewSet):
    queryset = RemoteDeploymentMachine.objects.all()
    serializer_class = RemoteDeploymentMachineSerializer

class DeploymentTargetViewSet(DeploymentManagerModelViewSet):
    queryset = DeploymentTarget.objects.all()
    serializer_class = DeploymentTargetSerializer

class FirmwareViewSet(DeploymentManagerModelViewSet):
    queryset = Firmware.objects.all()
    serializer_class = FirmwareSerializer

    @list_route(methods=['get'], authentication_classes=[SessionAuthentication], permission_classes=[IsSuperUser])
    def get_mounting_devices(self, request, pk=None):
        base = "/dev/"
        devices = [os.path.join(base, f) for f in listdir(base) if re.match("^sd[a-z]$", f) or re.match("^rdisk[1-9]$", f)]
        return Response(data=devices, status=status.HTTP_200_OK)

class COMMAND(object):
    def run(self, lock):
        pass

class BASH_COMMAND(COMMAND):
    def __init__(self, cmd, silent=False):
        self.cmd = cmd
        self.silent = silent

    def run(self, lock):
        lock.stdout += "~~~~{}".format(self.cmd)
        lock.save()

        proc = subprocess.Popen(self.cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        (out, err) = proc.communicate()
        ret = proc.returncode

        lock.stdout += out.decode() + "\n" + err.decode() + "\n"
        lock.save()
        if ret != 0 and not self.silent:
            raise Exception("{} ==> {}".format(self.cmd, ret))

class WRITE_FILE_COMMAND(COMMAND):
    def __init__(self, path, content, silent=False):
        self.path = path
        self.content = content
        self.silent = silent

    def run(self, lock):
        try:
            with open(self.path, "wb") as F:
                F.write(self.content.encode('utf-8'))
            lock.stdout += "Wrote to file {}\n".format(self.path)
            lock.save()
        except Exception as e:
            if not self.silent:
                raise e

class DeploymentThread(threading.Thread):
    def __init__(self, deployment_lock, disk_path, firmware, config, dep, params, options, disabled_repo_ids):
        threading.Thread.__init__(self)
        self.firmware = firmware
        self.deployment_lock = deployment_lock
        self.config = config
        self.deployment = dep
        self.parameters = params
        self.build_options = options
        self.repositories = self.find_all_repositories(base=self.config)
        self.files = self.find_all_files(base=self.config)
        self.disabled_repo_ids = disabled_repo_ids

        self.command_queue = []
        self.disk_path = disk_path
        self.disk_partition_path = self.disk_path + "2"
        self.mounting_point = "/home/pi/mnt/"
        self.deployment_info_filename = "/home/pi/.deployment"

    def run(self):
        try:
            self.deploy()
        except Exception as e:
            print (e)
            self.deployment_lock.status = str(e)
            self.deployment_lock.save()
            self.deployment.delete()
        finally:
            if self.deployment_lock.status == "":
                self.deployment_lock.status = "OK"
                self.deployment_lock.save()

    def deploy(self):
        self.setup_image()
        self.clone_repositories()
        self.copy_files()
        self.unmount_image()

        for cmd in self.command_queue:
            cmd.run(self.deployment_lock)

    def queue_command(self, cmd):
        self.command_queue.append(cmd)

    def setup_image(self):
        if self.firmware:
            self.queue_command(BASH_COMMAND("dd if={} of={} bs=8M".format(self.firmware.local_path, self.disk_path)))
        self.queue_command(BASH_COMMAND("umount {}".format(self.mounting_point), silent=True))
        self.queue_command(BASH_COMMAND("rm -rf {}".format(self.mounting_point), silent=True))
        self.queue_command(BASH_COMMAND("mkdir {}".format(self.mounting_point)))
        self.queue_command(BASH_COMMAND("mount {} {}".format(self.disk_partition_path, self.mounting_point)))

    def unmount_image(self):
        self.queue_command(BASH_COMMAND("sync"))
        self.queue_command(BASH_COMMAND("umount {}".format(self.mounting_point), silent=True))
        self.queue_command(BASH_COMMAND("rm -rf {}".format(self.mounting_point), silent=True))

    def clone_repositories(self):
        for repo in self.repositories:
            if repo.id in self.disabled_repo_ids:
                continue
            repo_local_path = repo.repo.local_path
            if len(repo_local_path) > 0 and repo_local_path[0] == '/': repo_local_path = repo_local_path[1:]
            local_path = os.path.join(self.mounting_point, repo_local_path)
            self.queue_command(BASH_COMMAND("rm -rf {}".format(local_path), silent=True))
            if repo.repo.local_cache:
                self.queue_command(BASH_COMMAND("git clone {} {}".format(repo.repo.local_cache, local_path)))
                self.queue_command(BASH_COMMAND("cd {} && git checkout {}".format(local_path, repo.commit)))
            else:
                self.queue_command(BASH_COMMAND("eval \"$(ssh-agent -s)\" && ssh-add /home/pi/.ssh/id_rsa && git clone {} {} && sudo killall ssh-agent".format(repo.repo.remote_path, local_path)))
                self.queue_command(BASH_COMMAND("cd {} && git checkout {}".format(local_path, repo.commit)))
            for op in sorted(list(filter(lambda op: op.repo.id == repo.repo.id, self.build_options)), key=lambda op: op.option_priority):
                self.queue_command(BASH_COMMAND("cd {} && {}".format(local_path, op.option_command)))

    def copy_files(self):
        ARGUMENTS = {}
        for param in self.parameters:
            ARGUMENTS[param.parameter_name] = param.parameter_value
        for file in self.files:
            target_filename = file.target_filename
            if len(target_filename) > 0 and target_filename[0] == '/': target_filename = target_filename[1:]
            local_path = os.path.join(self.mounting_point, target_filename)

            content = file.file_contents
            for kw in re.findall('\{\{(.+)\}\}', content):
                content = content.replace("{{" + kw + "}}", str(ARGUMENTS[kw]))
            content = content.replace('\r\n', '\n')
            self.queue_command(WRITE_FILE_COMMAND(local_path, content))
            if file.is_executable:
                self.queue_command(BASH_COMMAND("chmod +x {}".format(local_path)))
        # write deployment info file
        self.queue_command(WRITE_FILE_COMMAND(os.path.join(self.mounting_point, self.deployment_info_filename), self.get_deployment_info()))

    def get_deployment_info(self):
        return json.dumps({
            "firmware": self.firmware.id if self.firmware else -1,
            "config": self.config.id,
            "deployment": self.deployment.id,
            "date": str(self.deployment.date),
            "target": self.deployment.target,
            "comment": self.deployment.comment,
        })
