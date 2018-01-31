from django.core.mail import send_mail

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

import threading

def send_contact_us_email(name, email, hotel, role, additional_info, request_demo):
    subject = 'Message from {}'.format(name)
    contact_reason = "Reach out to"
    if request_demo:
        contact_reason = "Demo Request from"
    message = '{} {}, {} at {}, through {}. Additional Info: {}'.format(contact_reason, name, role, hotel, email, additional_info)

    send_mail(
        subject,
        message,
        'contact@verboze.com',
        ['contact@verboze.com'],
        fail_silently=False,
    )

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
        request_demo = request.data.get('requestDemo', None)

        if name and email and hotel and role:
            try:
                thread = threading.Thread(target=send_contact_us_email, args=(name, email, hotel, role, additional_info, request_demo))
                thread.start()
                return Response({}, status=status.HTTP_200_OK)
            except Exception as e:
                print (e)
                return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'error': 'Please provide all the required fields.'}, status=status.HTTP_400_BAD_REQUEST)
