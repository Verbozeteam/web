from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes, list_route
from rest_framework.views import APIView
from rest_framework import exceptions
from ifttt.authentication import FromIFTTT

from api.models.ws_models import Token
import api

from datetime import timedelta
from django.utils import timezone

# makes response content_type have charset=utf-8
def fix_response_for_ifttt(view_func):
    def wrapper(*args, **vargs):
        r = view_func(*args, **vargs)
        r.content_type = "application/json; charset=utf-8"
        if r.status_code >= 300:
            if type(r.data) == type([]):
                r.data = {"errors": list(map(lambda m: {"message": str(m)}, r.data))}
            elif type(r.data) == type({}):
                if 'detail' in r.data:
                    r.data = {"errors": [{"message": str(r.data['detail'])}]}
        return r
    return wrapper

def action_endpoint(view_func, method=['POST'], auth=[FromIFTTT], perm=[]):
    @csrf_exempt
    @fix_response_for_ifttt
    @api_view(method)
    @authentication_classes(auth)
    @permission_classes(perm)
    def wrapper(*args, **vargs):
        return view_func(*args, **vargs)
    return wrapper

#
# API endpoint for IFTTT status report
#
@api_view(['GET'])
@authentication_classes([FromIFTTT])
@permission_classes([])
def status_view(request):
    return Response({}, status=status.HTTP_200_OK)

#
# API endpoint for IFTTT setup
#
@csrf_exempt
@fix_response_for_ifttt
@api_view(['POST'])
@authentication_classes([FromIFTTT])
@permission_classes([])
def setup_view(request):
    token = Token.objects.create(expiry=timezone.now() + timedelta(minutes=3))
    return Response({
        "data": {
            # "accessToken": token.id,
            "samples": {
                "triggers": {

                },
                "actions": {
                    "turn_light_on": {
                        "verboze_token": token.id,
                        "light_id": "test_id"
                    },
                    "turn_light_off": {
                        "verboze_token": token.id,
                        "light_id": "test_id"
                    }
                }
            }
        }
    }, status=status.HTTP_200_OK)

#
# API Endpoints for actions
#
@action_endpoint
def turn_light_on(request):
    if 'actionFields' not in request.data or 'verboze_token' not in request.data['actionFields'] or 'light_id' not in request.data['actionFields']:
        raise exceptions.ValidationError('Missing action fields')
    token = request.data['actionFields']['verboze_token']
    light_id = request.data['actionFields']['light_id']

    try:
        token = Token.objects.get(id=token)
    except:
        raise exceptions.ValidationError('Invalid Verboze token')

    api.consumers.on_message_from_phone(token, {"thing": light_id, "intensity": 1})

    return Response({
        "data": [{
            "id": "asdasd"
        }]
    }, status=status.HTTP_200_OK)

@action_endpoint
def turn_light_off(request):
    if 'actionFields' not in request.data or 'verboze_token' not in request.data['actionFields'] or 'light_id' not in request.data['actionFields']:
        raise exceptions.ValidationError('Missing action fields')
    token = request.data['actionFields']['verboze_token']
    light_id = request.data['actionFields']['light_id']

    try:
        token = Token.objects.get(id=token)
    except:
        raise exceptions.ValidationError('Invalid Verboze token')

    api.consumers.on_message_from_phone(token, {"thing": light_id, "intensity": 0})

    return Response({
        "data": [{
            "id": "asdasd"
        }]
    }, status=status.HTTP_200_OK)
