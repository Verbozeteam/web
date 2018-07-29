from deployment_manager.models import *
from rest_framework import serializers

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = '__all__'

class RepositoryBuildOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepositoryBuildOption
        fields = '__all__'

class DeploymentConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentConfig
        fields = '__all__'

class DeploymentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentFile
        fields = '__all__'

class FileDefaultParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileDefaultParameter
        fields = '__all__'

class DeploymentRepositoryForRDMSerializer(serializers.ModelSerializer):
    repo = RepositorySerializer(read_only=True)

    class Meta:
        model = DeploymentRepository
        fields = ('id', 'deployment', 'repo', 'commit',)

class DeploymentRepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentRepository
        fields = '__all__'

class DeploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deployment
        fields = '__all__'

class DeploymentParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentParameter
        fields = '__all__'

class DeploymentBuildOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentBuildOption
        fields = '__all__'

class RunningDeploymentSerializer(serializers.ModelSerializer):
    deployment = DeploymentSerializer(read_only=True)

    class Meta:
        model = RunningDeployment
        fields = ('id', 'status', 'stdout', 'deployment')

class DeploymentTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentTarget
        fields = '__all__'

class RemoteDeploymentMachineSerializer(serializers.ModelSerializer):
    targets = DeploymentTargetSerializer(many=True, read_only=True)

    class Meta:
        model = RemoteDeploymentMachine
        fields = ('id', 'channel_name', 'name', 'targets',)

class FirmwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Firmware
        fields = '__all__'
