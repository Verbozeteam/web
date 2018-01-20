from api.models import Token
from rest_framework import viewsets

from rest_framework.response import Response
from rest_framework import status

from datetime import timedelta
from django.utils import timezone


#
# API endpoint that allows Tokens to be created
#
class TokenViewSet(viewsets.ViewSet):
    authentication_classes = ()
    permission_classes = ()

    def create(self, request):
        try:
            if 'duration' in request.data and hasattr(request.user, 'hotel_user'):
                expiry = timezone.now() + timedelta(hours=request.data['duration'])
                # @TODO: IMPLEMENT THIS
                #token = Token.objects.create(expiry=expiry, content_type=, object_id=)
            else:
                expiry = timezone.now() + timedelta(minutes=30)
                token = Token.objects.create(expiry=expiry, content_type=None, object_id=None)
            return Response({'id': token.id}, status=status.HTTP_200_OK)
        except Exception as e:
            print (e)
            return Response({'error': 'Failed to create token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
