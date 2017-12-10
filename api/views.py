from api.models import Token, Room, Hotel, Hub
from api.permissions import IsHotelUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import exceptions
from api.serializers import RoomSerializer, HotelSerializer, HubSerializer
from api.authentication import ExpiringTokenAuthentication

from rest_framework.response import Response

from datetime import timedelta
from django.utils import timezone

#
# API endpoint that allows Tokens to be created
#
class TokenViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            if 'duration' in request.data and hasattr(request.user, 'hotel_user'):
                expiry = timezone.now() + timedelta(hours=request.data['duration'])
                # @TODO: IMPLEMENT THIS
                #token = Token.objects.create(expiry=expiry, content_type=, object_id=)
            else:
                expiry = timezone.now() + timedelta(minutes=30)
                token = Token.objects.create(expiry=expiry, content_type=None, object_id=None)
            return Response({"id": token.id})
        except Exception as e:
            print (e)
            return Response({'error': 'Failed to create token'})

#
# API endpoint that allows Rooms to be viewed
# Request must be coming from Hotel User
# Only rooms that belong to User's Hotel will be returned
#
class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated, IsHotelUser,)

    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        hotel_user = self.request.user.hotel_user
        # return all rooms in hotel that user belongs to
        return Room.objects.filter(hotel=hotel_user.hotel)


#
# API endpoint that allows Hotels to be viewed
#
class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated, IsHotelUser,)

    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


#
# API endpoint that allows Hubs to be viewed
#
class HubViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated, IsHotelUser,)

    queryset = Hub.objects.all()
    serializer_class = HubSerializer
