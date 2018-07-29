from django.contrib import admin
from deployment_manager.models import *

admin.site.register(Firmware)
admin.site.register(Repository)
admin.site.register(RepositoryBuildOption)
admin.site.register(DeploymentConfig)
admin.site.register(DeploymentFile)
admin.site.register(FileDefaultParameter)
admin.site.register(DeploymentRepository)
admin.site.register(Deployment)
admin.site.register(DeploymentParameter)
admin.site.register(RunningDeployment)
admin.site.register(RemoteDeploymentMachine)
admin.site.register(DeploymentTarget)
admin.site.register(DeploymentBuildOption)
