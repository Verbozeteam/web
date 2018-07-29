from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

class FromIFTTT(BaseAuthentication):
    def authenticate(self, request):
        if not request.META.get('HTTP_IFTTT_SERVICE_KEY', '') == settings.IFTTT_KEY or\
           not request.META.get('HTTP_IFTTT_CHANNEL_KEY', '') == settings.IFTTT_KEY:
            raise exceptions.AuthenticationFailed('Invalid user')
        return (None, None)

    def authenticate_header(self, request):
        return ':)'
