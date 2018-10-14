from api.models import Token as VerbozeToken, Hub, HubUser, Hotel, HotelUser, Room
from django.db.models import Q
from channels import Group

from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from raven.contrib.django.models import get_client
client = get_client()

import json
import uuid
from django.utils import timezone

def get_valid_token(token):
	# delete old tokens
	VerbozeToken.objects.filter(~Q(expiry=None), expiry__lt=timezone.now()).delete()
	try:
		token_object = VerbozeToken.objects.get(id=token)
	except (VerbozeToken.DoesNotExist, ValidationError):
		return None
	return token_object


def on_message_from_hub(sender_token, message_dict):
	# From hub means a message comes from within the hotel system (hub)
	__reply_target = message_dict.get("__reply_target", None)
	if __reply_target:
		# This means that this message coming from the hub, which got it from a room's kernel,
		# is a reply to a past message (e.g. a code 0) that was sent to that kernel. So now
		# we forward the reply to the original sender (a phone or a dashboard)
		del message_dict["__reply_target"]
		if __reply_target == "dashboard":
			target_hotel_dashboard = sender_token.content_object.hub.hotel
			ws_target_objects = [target_hotel_dashboard]
		else:
			target_room = Room.objects.get(identifier=__reply_target, hotel=sender_token.content_object.hub.hotel)
			ws_target_objects = [target_room]
	else:
		# no reply target means send to everyone (hotel dashboard and rooms(phones))
		hotel_dashboard = [sender_token.content_object.hub.hotel]
		hotel_rooms = list(Room.objects.filter(hotel=sender_token.content_object.hub.hotel))
		ws_target_objects = hotel_dashboard + hotel_rooms

	if "code" in message_dict:
		code = message_dict["code"]
		if code == 3:
			for room in Room.objects.filter(hotel=sender_token.content_object.hub.hotel):
				for token in room.tokens.all():
					try:
						token.delete()
						token.id = uuid.uuid4()
						token.save()
						sender_token.content_object.hub.ws_send_message({"text": json.dumps({"__room_id": room.identifier, "code": 4, "qr-code": str(token.id)})})
					except: pass
	else:
		message_json = {"text": json.dumps(message_dict)}
		for ws_target in ws_target_objects:
			ws_target.ws_send_message(message_json)

def on_message_from_dashboard(sender_token, message_dict):
	# message_dict["__room_id"] = sender_token.content_object.identifier
	message_dict["__reply_target"] = "dashboard"
	message_json = {"text": json.dumps(message_dict)}
	# forward message to hotel's hub
	hotel_hub = sender_token.content_object.hotel.hubs.first()
	hotel_hub.ws_send_message(message_json)

def on_message_from_phone(sender_token, message_dict):
	message_dict["__room_id"] = sender_token.content_object.identifier
	message_dict["__reply_target"] = sender_token.content_object.identifier
	message_json = {"text": json.dumps(message_dict)}
	hotel_hub = sender_token.content_object.hotel.hubs.first()
	# forward message to guest room's hotel's hub
	hotel_hub.ws_send_message(message_json)


@client.capture_exceptions
def ws_connect(message, token):
	token_object = get_valid_token(token)
	if token_object:
		# valid token, accept connection
		message.reply_channel.send({"accept": True})
		# add reply_channel to AdminUser/HubUser/HotelUser/GuestUser/Room group
		if token_object.content_object and (hasattr(token_object.content_object, 'user') or isinstance(token_object.content_object, Room)):
			group = token_object.content_object.websocket_group
		else:
			group = "temp-token-"+str(token_object.id)
		Group(group).add(message.reply_channel)
	else:
		# invalid connection, reject token
		message.reply_channel.send({"accept": False})


@client.capture_exceptions
def ws_receive(message, token):
	token_object = get_valid_token(token)
	message_text = message.content.get("text")
	if token_object and message_text:
		# valid token, and text data found
		message_dict = json.loads(message_text)
		message.reply_channel.send({"accept": True})
		if isinstance(token_object.content_object, HubUser):
			on_message_from_hub(token_object, message_dict)
		elif isinstance(token_object.content_object, HotelUser):
			on_message_from_dashboard(token_object, message_dict)
		elif isinstance(token_object.content_object, Room):
			on_message_from_phone(token_object, message_dict)
		else:
			# temporary token, do simple to the creator's front-end
			Group("temp-token-"+str(token_object.id)).send({"text": message_text})
	else:
		# invalid token or not text data found, close connection
		message.reply_channel.send({"close": True})


@client.capture_exceptions
def ws_disconnect(message, token):
	token_object = get_valid_token(token)
	if token_object:
		# valid token
		# Check if token belongs to a type of user or room
		if token_object.content_object and (hasattr(token_object.content_object, 'user') or isinstance(token_object.content_object, Room)):
			group = token_object.content_object.websocket_group
		else:
			group = "temp-token-"+str(token_object.id)
		# remove reply_channel from group
		Group(group).discard(message.reply_channel)
