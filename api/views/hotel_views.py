from api.models import Room, Hotel, Hub, Service, Token as VerbozeToken
from api.permissions import IsHotelUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.serializers import RoomSerializer, HotelSerializer, HubSerializer
from api.authentication import ExpiringTokenAuthentication

from rest_framework.response import Response
from rest_framework import status

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
    authentication_classes = ()
    permission_classes = ()

    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def get_object(self):
        try:
            lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
            if int(self.kwargs[lookup_url_kwarg]) == 0:
                if "vtoken" in self.request.query_params:
                    return VerbozeToken.objects.get(id=self.request.query_params["vtoken"]).get_hotel()
        except:
            pass
        return super(HotelViewSet, self).get_object()

#
# API endpoint that allows Hubs to be viewed
#
class HubViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated, IsHotelUser,)

    queryset = Hub.objects.all()
    serializer_class = HubSerializer

