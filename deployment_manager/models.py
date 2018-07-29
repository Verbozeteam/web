from django.db import models
from channels import Channel
from django.contrib.auth import get_user_model

class Repository(models.Model):
    """
        Represents a repository that can be used in a deployment
    """
    remote_path = models.CharField(max_length=2048, unique=True) # remote repository (e.g. github)
    local_path = models.CharField(max_length=256, default="")   # local path relative to mounted FS

    def __str__(self):
        return self.remote_path

class RepositoryBuildOption(models.Model):
    """
        Represents an option to be executed when a repository is cloned (e.g. make)
    """
    repo = models.ForeignKey(Repository, on_delete=models.CASCADE)
    option_name = models.CharField(max_length=256)
    option_command = models.CharField(max_length=1024)
    option_priority = models.IntegerField(default=1)

    def __str__(self):
        return "{}: {} ({})".format(self.repo, self.option_name, self.option_priority)

class DeploymentConfig(models.Model):
    class Meta:
        unique_together = ('name', 'version')

    """
        Represents a deployment scheme. This model and all its children cannot be
        modified if there is a deployment made using this configuration.
    """
    parent = models.ForeignKey('DeploymentConfig', on_delete=models.CASCADE, blank=True, null=True, default=None)
    name = models.CharField(max_length=256)
    version = models.IntegerField(default=1)

    def can_be_changed(self):
        if not self.pk:
            return True # new deployment config - no problem

        if Deployment.objects.filter(config=self.pk).exists():
            return False # Deployment configuration is deployed somewhere

        if DeploymentConfig.objects.filter(name=self.name, version=self.version+1).exists():
            return False # If a new version is available, this is not editable

        # make sure no child deployment config has been deployed either
        children = list(DeploymentConfig.objects.filter(parent=self))
        while len(children) > 0:
            c = children[0]
            children = children[1:]
            if Deployment.objects.filter(config=c.pk).exists():
                return False # Child deployment configuration is deployed somewhere
            children += list(DeploymentConfig.objects.filter(parent=c)) # get grandchildren

        return True

    def save(self, *args, **kwargs):
        if not self.can_be_changed():
            raise Exception('Already deployed! you cannot change this!')
        super(DeploymentConfig, self).save(*args, **kwargs)

    def __str__(self):
        return "{} (v{})".format(self.name, self.version)

class DeploymentFile(models.Model):
    """
        Represents a file that is to be cp'd (forced) onto the deployed image
    """
    class Meta:
        unique_together = ('deployment', 'target_filename')

    deployment = models.ForeignKey(DeploymentConfig, on_delete=models.CASCADE)
    target_filename = models.CharField(max_length=256)
    file_contents = models.TextField(default="", blank=True)
    is_executable = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.deployment.can_be_changed():
            raise Exception('Already deployed! you cannot change this!')
        super(DeploymentFile, self).save(*args, **kwargs)

    def __str__(self):
        return "[{}] {}".format(self.deployment, self.target_filename)

class FileDefaultParameter(models.Model):
    """
        A default parameter to use when a file is deployed
    """
    class Meta:
        unique_together = ('file', 'parameter_name')

    file = models.ForeignKey(DeploymentFile, on_delete=models.CASCADE)
    is_required = models.BooleanField()
    parameter_name = models.CharField(max_length=64)
    parameter_value = models.CharField(max_length=512, blank=True)

    def __str__(self):
        return "[{}] {}:{} ({})".format(self.file, self.parameter_name, self.parameter_value, "required" if self.is_required else "not required")

class DeploymentRepository(models.Model):
    """
        A repository to be cloned on deployment
    """
    class Meta:
        unique_together = ('deployment', 'repo')

    deployment = models.ForeignKey(DeploymentConfig, on_delete=models.CASCADE)
    repo = models.ForeignKey(Repository, on_delete=models.CASCADE)
    commit = models.CharField(max_length=256, default='master')

    def save(self, *args, **kwargs):
        if not self.deployment.can_be_changed():
            raise Exception('Already deployed! you cannot change this!')
        super(DeploymentRepository, self).save(*args, **kwargs)

    def __str__(self):
        return "[{}] {} ({})".format(self.deployment, self.repo, self.commit)

class Deployment(models.Model):
    """
        A deployment that has already occurred
    """
    config = models.ForeignKey(DeploymentConfig, on_delete=models.PROTECT)
    date = models.DateTimeField(auto_now_add=True)
    target = models.CharField(max_length=256)
    comment = models.TextField(blank=True)

    def __str__(self):
        return "[{}] {}".format(self.date, self.config)

class DeploymentParameter(models.Model):
    """
        A parameter used in a deployment
    """
    deployment = models.ForeignKey(Deployment, on_delete=models.CASCADE)
    parameter_name = models.CharField(max_length=64)
    parameter_value = models.CharField(max_length=512)

    def __str__(self):
        return "[{}] {}:{}".format(self.deployment, self.parameter_name, self.parameter_value)

class DeploymentBuildOption(models.Model):
    """
        A build option used in a deployment
    """
    deployment = models.ForeignKey(
        Deployment,
        on_delete=models.CASCADE,
        null=True,
        related_name='build_options',
        related_query_name='build_option'
    )
    option_name = models.CharField(max_length=256)
    option_command = models.CharField(max_length=1024)
    option_priority = models.IntegerField(default=1)

    def __str__(self):
        return "{}: {}".format(self.deployment, self.option_name, self.option_command, self.option_priority)

class RunningDeployment(models.Model):
    """
        A deployment currently happening
    """
    deployment = models.ForeignKey(
        Deployment,
        on_delete=models.CASCADE,
        null=True,
        related_name="running_deployments",
        related_query_name="running_deployment"
    )
    status = models.TextField(default="", blank=True)
    stdout = models.TextField(default="", blank=True)

    def __str__(self):
        return "{}: {}".format(self.deployment, self.status)

class RemoteDeploymentMachine(models.Model):
    """
        An actively connected remote deployment machines
        (record is deleted when websocket disconnects)
    """
    channel_name = models.CharField(max_length=128, default="", blank=True)
    name = models.CharField(max_length=128, default="", unique=True)
    user = models.ForeignKey(
        get_user_model(),
        default=None,
        on_delete=models.CASCADE,
        related_name="remote_deployment_machines",
        related_query_name="remote_deployment_machine"
    )

    def __str__(self):
        return "{}".format(self.name)

    def ws_send_message(self, message):
        Channel(self.channel_name).send(message)

class DeploymentTarget(models.Model):
    """
        A target available on a Remote Deployment Machine
    """
    remote_deployment_machine = models.ForeignKey(
        RemoteDeploymentMachine,
        default=None,
        on_delete=models.CASCADE,
        related_name="targets",
        related_query_name="target"
    )
    identifier = models.CharField(max_length=128, default="")
    status = models.CharField(max_length=128, default="")

    def __str__(self):
        return "{} on {}".format(self.identifier, self.remote_deployment_machine)

class Firmware(models.Model):
    """
        Represents an existing .img file to be dd'd on an SD card
        Available on Remote Deployment Machine
    """
    remote_deployment_machine = models.ForeignKey(RemoteDeploymentMachine, on_delete=models.CASCADE, related_name="firmwares", related_query_name="firmware")
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return "{} on {}".format(self.name, self.remote_deployment_machine)
