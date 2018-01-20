import datetime
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token as AuthToken

class ObtainExpiringAuthToken(ObtainAuthToken):
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            auth_token, created =  AuthToken.objects.get_or_create(user=serializer.validated_data['user'])

            if not created:
                # delete old token and create a new one
                auth_token.delete()
                auth_token = AuthToken.objects.create(user=serializer.validated_data['user'])
                auth_token.created = datetime.datetime.utcnow()
                auth_token.save()

            return JsonResponse({'token': auth_token.key})
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
