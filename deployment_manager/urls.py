"""interface URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from rest_framework import routers
from deployment_manager import views

router = routers.DefaultRouter()
router.register(r'running_deployment', views.RunningDeploymentViewSet)
router.register(r'firmware', views.FirmwareViewSet)
router.register(r'repository', views.RepositoryViewSet)
router.register(r'repository_build_option', views.RepositoryBuildOptionViewSet)
router.register(r'deployment_config', views.DeploymentConfigViewSet)
router.register(r'deployment_file', views.DeploymentFileViewSet)
router.register(r'file_default_parameter', views.FileDefaultParameterViewSet)
router.register(r'deployment_repository', views.DeploymentRepositoryViewSet)
router.register(r'deployment', views.DeploymentViewSet, base_name='deployment')
router.register(r'deployment_parameter', views.DeploymentParameterViewSet)
router.register(r'deployment_build_option', views.DeploymentBuildOptionViewSet)
router.register(r'remote_deployment_machine', views.RemoteDeploymentMachineViewSet)
router.register(r'deployment_target', views.DeploymentTargetViewSet)

urlpatterns = [
    url(r'^/?$', views.home_view, name='home'),
    url(r'^', include(router.urls)),
]
