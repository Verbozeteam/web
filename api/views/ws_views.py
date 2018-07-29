from api.models import Token
from deployment_manager.models import RemoteDeploymentMachine
from rest_framework import viewsets

from rest_framework.response import Response
from rest_framework import status

from datetime import timedelta
from django.utils import timezone

from rest_framework.authentication import SessionAuthentication

from django.contrib.contenttypes.models import ContentType
from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model, authenticate

#
# API endpoint that allows Tokens to be created
#
class TokenViewSet(viewsets.ViewSet):
    authentication_classes = ()
    permission_classes = ()

    def determine_token_params(self, request, user):
        # If token is created for an anonymous user (such as website demo), keep those defaults
        error = None
        expiry = timezone.now() + timedelta(minutes=30)
        content_type = None
        object_id = None

        if user:
            if 'deployment_manager' in request.data and user.is_superuser:
                # Token is created for deployment manager front-end (to create a deployment)
                # Logged in by an admin
                expiry = timezone.now() + timedelta(hours=24)
                content_type = ContentType.objects.get(model='user')
                object_id = user.id
            elif 'machine' in request.data and user.is_superuser:
                # Token is created for remote deployment machine (deployment script)
                # Logged in by an admin user
                machine = request.data.get('machine')
                expiry = timezone.now() + timedelta(hours=24)
                content_type = ContentType.objects.get(model='user')
                object_id = user.id
                try:
                    rdm = RemoteDeploymentMachine.objects.create(name=machine, user=user)
                except:
                    error = 'Machine already logged in'
            else:
                # Its a general user login
                # @TODO: different cases for different user types
                expiry = timezone.now() + timedelta(hours=24)
                if hasattr(user, 'hub_user'):
                    # Aggregator user trying to log in - this should never happen
                    error = 'Testa3bat yabni?'
                elif hasattr(user, 'hotel_user'):
                    # @TODO: Handle hotel (user) requesting token
                    pass
                elif hasattr(user, 'guest_user'):
                    # @TODO Handle Guest (user) requesting token
                    pass
                else:
                    # This is where a user (most likely admin) visits homepage
                    pass # @TODO: ...

        return error, expiry, content_type, object_id

    def validate_user(self, request):
        User = get_user_model()

        # attempt to authenticate user with provided username & password
        if 'username' in request.data and 'password' in request.data:
            user = authenticate(username=request.data['username'], password=request.data['password'])
            if user:
                return None, user
            return Response({'error': 'Incorrect username or password'}, status=status.HTTP_401_UNAUTHORIZED), None

        # attempt to validate user through the session
        else:
            try:
                session = Session.objects.get(session_key=request.session.session_key)
                session_data = session.get_decoded()
                user_id = session_data.get('_auth_user_id')
                user = User.objects.get(id=user_id)
                return None, user

            # session matching the query does not exist, check if anonymous user
            except Session.DoesNotExist:
                if request.user.is_anonymous:
                    return None, None
                return Response({'error': 'No user credentials and session does not exist'}, status=status.HTTP_400_BAD_REQUEST), None


    def create(self, request):

        err, user = self.validate_user(request)
        if err:
            return err
        try:
            err, expiry, user_contenttype, object_id = self.determine_token_params(request, user)
            if err:
                return Response({'error': err}, status=status.HTTP_400_BAD_REQUEST)
            token = Token.objects.create(expiry=expiry, content_object=user if user else None)
            return Response({'id': token.id}, status=status.HTTP_200_OK)
        except Exception as e:
            print (e)
            return Response({'error': 'Failed to create token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
