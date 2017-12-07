from api.models import Token, Room, Hotel, Hub
from api.permissions import IsHotelUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import exceptions
from api.serializers import TokenSerializer, RoomSerializer, HotelSerializer, HubSerializer
from api.authentication import ExpiringTokenAuthentication


class TokenViewSet(viewsets.ReadOnlyModelViewSet):
    #
    # API endpoint that allows Tokens to be viewed
    #
    queryset = Token.objects.all()
    serializer_class = TokenSerializer


class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    #
    # API endpoint that allows Rooms to be viewed
    #
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated, IsHotelUser,)

    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        hotel_user = self.request.user.hotel_user
        print ("HOTEL USER", hotel_user)
        hotel = Hotel.objects.get(hotel_user=hotel_user)

        # return all rooms in hotel that user belongs to
        return Room.objects.filter(hotel=hotel)


        # return Room.objects.filter(hotel=hotel_user.hotel)



class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    #
    # API endpoint that allows Hotels to be viewed
    #
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


class HubViewSet(viewsets.ReadOnlyModelViewSet):
    #
    # API endpoint that allows Hubs to be viewed
    #
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
