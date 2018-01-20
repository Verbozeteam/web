from api.models import Token as VerbozeToken, Hub, Hotel, Room
from django.db.models import Q
from channels import Group

from django.core.exceptions import ValidationError

import json
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
	# From hub means a message comes from within the hotel system (tablets)
	# check room name list
	__reply_target = message_dict.get("__reply_target", None)
	if __reply_target:
		# This means that this message coming from the hub, which got it from a room's kernel,
		# is a reply to a past message (e.g. a code 0) that was sent to that kernel. So now
		# we forward the reply to the original sender (a phone or a dashboard)
		del message_dict["__reply_target"]
		if __reply_target == "dashboard":
			target_hotel_dashboard = sender_token.content_object.hotel
			ws_target_objects = [target_hotel_dashboard]
		else:
			target_room = Room.objects.get(identifier=__reply_target, hotel=sender_token.content_object.hotel)
			ws_target_objects = [target_room]
	else:
		# no reply target means send to everyone (hotel dashboard and rooms(phones))
		hotel_dashboard = [sender_token.content_object.hotel]
		hotel_rooms = [Room.objects.get(hotel=sender_token.content_object.hotel)]
		ws_target_objects = hotel_dashboard + hotel_rooms

	message_json = {"text": json.dumps(message_dict)}
	for ws_target in ws_target_objects:
		ws_target.ws_send_message(message_json)

def on_message_from_dashboard(sender_token, message_dict):
	# message_dict["__room_id"] = sender_token.content_object.identifier
	message_dict["__reply_target"] = "dashboard"
	message_json["text"] = json.dumps(message_dict)
	# forward message to hotel's hub
	hotel_hub = sender_token.content_object.hubs.first()
	hotel_hub.ws_send_message(message_json)

def on_message_from_phone(sender_token, message_dict):
	message_dict["__room_id"] = sender_token.content_object.identifier
	message_dict["__reply_target"] = sender_token.content_object.identifier
	message_json["text"] = json.dumps(message_dict)
	hotel_hub = sender_token.content_object.hotel.hubs.first()
	# forward message to guest room's hotel's hub
	hotel_hub.ws_send_message(message_json)


def ws_connect(message, token):
	token_object = get_valid_token(token)
	if token_object:
		# valid token, accept connection
		message.reply_channel.send({"accept": True})
		# add reply_channel to Hub/Hotel/Room group
		if token_object.content_object:
			group = token_object.content_object.websocket_group
		else:
			group = "temp-token-"+str(token_object.id)
		Group(group).add(message.reply_channel)
	else:
		# invalid connection, reject token
		message.reply_channel.send({"accept": False})


def ws_receive(message, token):
	token_object = get_valid_token(token)
	message_text = message.content.get("text")
	if token_object and message_text:
		# valid token, and text data found
		message_dict = json.loads(message_text)
		message.reply_channel.send({"accept": True})
		if isinstance(token_object.content_object, Hub):
			on_message_from_hub(token_object, message_dict)
		elif isinstance(token_object.content_object, Hotel):
			on_message_from_dashboard(token_object, message_dict)
		elif isinstance(token_object.content_object, Room):
			on_message_from_phone(token_object, message_dict)
		else:
			# temporary token, do simple to the creator's front-end
			Group("temp-token-"+str(token_object.id)).send({"text": message_text})
	else:
		# invalid token or not text data found, reject connection
		message.reply_channel.send({"accept": False})


def ws_disconnect(message, token):
	token_object = get_valid_token(token)
	if token_object:
		# valid token
		if token_object.content_object:
			group = token_object.content_object.websocket_group
		else:
			group = "temp-token-"+str(token_object.id)
		# remove reply_channel from group
		Group(group).discard(message.reply_channel)
