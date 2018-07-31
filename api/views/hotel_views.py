from api.models import Room, Hotel, Hub, Service, Token as VerbozeToken
from api.permissions import IsHotelUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.serializers import RoomSerializer, HotelSerializer, HubSerializer
from api.authentication import VerbozeTokenAuthentication

from rest_framework.response import Response
from rest_framework import status
from rest_framework import exceptions

import json

#
# API endpoint that allows Rooms to be viewed
# Request must be coming from Hotel User
# Only rooms that belong to User's Hotel will be returned
#
class RoomViewSet(viewsets.ModelViewSet):
    authentication_classes = (VerbozeTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        hotel_user = self.request.user.hotel_user
        # return all rooms in hotel that user belongs to
        return Room.objects.filter(hotel=hotel_user.hotel)

    def create(self, request):
        try:
            hotel = request.user.hub_user.hub.hotel
            request_data = request.data.copy()
            request_data['hotel'] = hotel.id
        except Exception as e:
            return Response({'error': 'Could not determine hotel - {}'.format(e)}, status=status.HTTP_400_BAD_REQUEST)

        if 'name' not in request_data:
            request_data['name'] = request_data['identifier']

        try:
            room = self.queryset.get(identifier=request_data['identifier'], hotel=hotel)
            serializer = self.serializer_class(room, data=request_data)
        except:
            room = None
            serializer = self.serializer_class(data=request_data)
        serializer.hotel_object = hotel

        if serializer.is_valid():
            serializer.save()
            if room == None:
                room = self.queryset.get(identifier=request_data['identifier'], hotel=hotel)
                # need to create a token for it
                tokens = [VerbozeToken.objects.create(content_object=room)]
            else:
                tokens = room.tokens.all()
            if len(tokens) > 0:
                request.user.hub_user.hub.ws_send_message({"text": json.dumps({"__room_id": room.identifier, "code": 4, "qr-code": str(tokens[0].id)})})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

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
    authentication_classes = (VerbozeTokenAuthentication,)
    permission_classes = (IsAuthenticated, IsHotelUser,)

    queryset = Hub.objects.all()
    serializer_class = HubSerializer

