import datetime
from django.utils.timezone import utc
from rest_framework.authentication import TokenAuthentication
from api.models.ws_models import Token
from django.contrib.auth import get_user_model
from rest_framework import exceptions
from django.core.exceptions import ValidationError
from django.utils import timezone

class VerbozeTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            auth_token = Token.objects.get(id=key)
        except (Token.DoesNotExist, ValidationError):
            raise exceptions.AuthenticationFailed('Invalid Auth Token')

        if not isinstance(auth_token.content_object.user, get_user_model()):
            raise exceptions.AuthenticationFailed('Token is not associated with a user (maybe temporary?)')

        if not auth_token.content_object.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        time_now = timezone.now()

        if auth_token.expiry and auth_token.expiry < time_now:
            auth_token.delete()
            raise exceptions.AuthenticationFailed('Auth Token has expired')

        return (auth_token.content_object.user, auth_token)

