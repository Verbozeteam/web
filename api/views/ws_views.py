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

    VALID_TOKEN_TYPES = ['anonymous_user', 'admin_user', 'hub_user', 'hotel_user', 'guest_user']

    def determine_token_params(self, request, user):
        # If token is created for an anonymous user (such as website demo), keep those defaults
        error = None
        expiry = timezone.now() + timedelta(minutes=30)
        content_type = None
        object_id = None

        if user:
            if 'deployment_manager' in request.data and request.data['requested_token_type'] == 'admin_user' and hasattr(user, 'admin_user'):
                # Token is created for deployment manager front-end (to create a deployment)
                # Logged in by an admin
                expiry = timezone.now() + timedelta(hours=24)
                content_type = ContentType.objects.get(model='adminuser')
                object_id = user.admin_user.id
            elif 'machine' in request.data and request.data['requested_token_type'] == 'admin_user' and hasattr(user, 'admin_user'):
                # Token is created for remote deployment machine (deployment script)
                # Logged in by an admin user
                machine = request.data.get('machine')
                expiry = timezone.now() + timedelta(hours=24)
                content_type = ContentType.objects.get(model='adminuser')
                object_id = user.admin_user.id
                try:
                    rdm = RemoteDeploymentMachine.objects.create(name=machine, admin_user=user.admin_user)
                except:
                    error = 'Machine already logged in'
            else:
                # Its a general user login
                # @TODO: different cases for different user types
                expiry = timezone.now() + timedelta(hours=24)
                requested_token_type = request.data['requested_token_type']

                # Handle Admin (user) requesting token
                if requested_token_type == 'admin_user' and hasattr(user, 'admin_user'):
                    content_type = ContentType.objects.get(model='adminuser')
                    object_id = user.admin_user.id
                    # Any additional logic for admin users
                    # ...

                # Handle Hub (user) requesting token (should not happen according to Hasan)
                elif requested_token_type == 'hub_user' and hasattr(user, 'hub_user'):
                    # Aggregator user trying to log in - this should never happen
                    error = 'Testa3bat yabni?'
                    # Any additional logic for hub users
                    # ...

                # Handle Hotel (user) requesting token
                elif requested_token_type == 'hotel_user' and hasattr(user, 'hotel_user'):
                    content_type = ContentType.objects.get(model='hoteluser')
                    object_id = user.hotel_user.id
                    # Any additional logic for hotel users
                    # ...

                # Handle Guest (user) requesting token
                elif requested_token_type == 'guest_user' and hasattr(user, 'guest_user'):
                    content_type = ContentType.objects.get(model='guestuser')
                    object_id = user.guest_user.id
                    # Any additional logic for guest users
                    # ...

                else:
                    # Invalid permissions for requested token
                    error = 'You do not have permissions to request such token'

        return error, expiry, content_type, object_id

    def validate_user(self, request):
        User = get_user_model()

        # check if 'requested_token_type' is provided otherwise we cannot give a token
        if not 'requested_token_type' in request.data:
            return Response({'error': 'No \'requested_token_type\' provided'}, status.HTTP_400_BAD_REQUEST), None

        # check if 'requested_token_type' is a valid token type
        if request.data['requested_token_type'] not in TokenViewSet.VALID_TOKEN_TYPES:
            return Response({'error': 'Invalid requested_token_type provided'}, status.HTTP_400_BAD_REQUEST), None

        # requested temp token with minimal access
        if request.data['requested_token_type'] == 'anonymous_user':
            return None, None

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
                # if request.user.is_anonymous:
                #     print('could be returning from here??')
                #     return None, None
                return Response({'error': 'No user credentials and session does not exist'}, status=status.HTTP_400_BAD_REQUEST), None


    def create(self, request):

        err, user = self.validate_user(request)
        if err:
            return err
        try:
            err, expiry, user_contenttype, object_id = self.determine_token_params(request, user)
            if err:
                return Response({'error': err}, status=status.HTTP_400_BAD_REQUEST)
            if user: # ever django user must be associated with one of our 'custom' users
                token = Token.objects.create(expiry=expiry, content_type=user_contenttype, object_id=object_id)
            else:
                token = Token.objects.create(expiry=expiry, content_object=None)
            return Response({'id': token.id}, status=status.HTTP_200_OK)
        except Exception as e:
            print (e)
            return Response({'error': 'Failed to create token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)
