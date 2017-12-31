from api.models import Token, Room, Hotel, Hub
from api.permissions import IsHotelUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import exceptions
from api.serializers import RoomSerializer, HotelSerializer, HubSerializer
from api.authentication import ExpiringTokenAuthentication

from api.views_utils import send_contact_us_email

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from datetime import timedelta
from django.utils import timezone

import threading


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


#
# API endpoint that creates a thread to send us email from `Contact` page in `Public Website`
#
class ContactUs(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request, format=None):
        name = request.data.get('name', None)
        email = request.data.get('email', None)
        hotel = request.data.get('hotel', None)
        role = request.data.get('role', None)
        additional_info = request.data.get('additionalInfo', None)

        if name and email and hotel and role:
            try:
                thread = threading.Thread(target=send_contact_us_email, args=(name, email, hotel, role, additional_info))
                thread.start()
                return Response({}, status=status.HTTP_200_OK)
            except Exception as e:
                print (e)
                return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'error': 'Please provide all the required fields.'}, status=status.HTTP_400_BAD_REQUEST)
