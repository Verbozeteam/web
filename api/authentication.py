import datetime
from django.utils.timezone import utc
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token as AuthToken
from rest_framework import exceptions

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            auth_token = AuthToken.objects.get(key=key)
        except AuthToken.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid Auth Token')

        if not auth_token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        utc_now = datetime.datetime.now(datetime.timezone.utc)

        # if auth_token.created < utc_now - datetime.timedelta(hours=24):
        if auth_token.created < utc_now - datetime.timedelta(hours=5):
            raise exceptions.AuthenticationFailed('Auth Token has expired')

        return (auth_token.user, auth_token)
