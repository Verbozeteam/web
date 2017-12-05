from api.models import Token, Room, Hotel, Hub
from rest_framework import viewsets
from api.serializers import TokenSerializer, RoomSerializer, HotelSerializer, HubSerializer


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
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


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
