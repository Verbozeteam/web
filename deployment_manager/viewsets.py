from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from deployment_manager.permissions import IsSuperUser

class DeploymentManagerModelViewSet(viewsets.ModelViewSet):
    def __init__(self, *args, **kwargs):
        super(viewsets.ModelViewSet, self).__init__(*args, **kwargs)

    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsSuperUser,)
