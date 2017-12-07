from api.models import Token, Hub, Hotel, Room
from channels import Group

from django.core.exceptions import ValidationError

import json

def get_valid_token(token):
	try:
		token_object = Token.objects.get(id=token, expired=False)
	except (Token.DoesNotExist, ValidationError):
		return None
	return token_object


def ws_connect(message, token):
	token_object = get_valid_token(token)
	if token_object:
		# valid token, accept connection
		message.reply_channel.send({"accept": True})
		# add reply_channel to Hub/Hotel/Room group
		group = token_object.content_object.websocket_group
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
		message_json = {}
		message.reply_channel.send({"accept": True})
		if isinstance(token_object.content_object, Hub):
			# message from hub
			# check room name list
			__reply_target = message_dict.get("__reply_target", None)
			if __reply_target:
				#
				del message_dict["__reply_target"]
				if __reply_target == "dashboard":
					target_hotel_dashboard = token_object.content_object.hotel
					ws_target_objects = [target_hotel_dashboard]
				else:
					target_room = Room.objects.get(identifier=__reply_target, hotel=token_object.content_object.hotel)
					ws_target_objects = [target_room]
			else:
				# no reply target means send to everyone (hotel dashboard and rooms)
				hotel_dashboard = [token_object.content_object.hotel]
				hotel_rooms = list(Room.objects.get(hotel=token_object.content_object.hotel))
				ws_target_objects = hotel_dashboard + hotel_rooms

			message_json["text"] = json.dumps(message_dict)
			for ws_target in ws_target_objects:
				ws_target.send_message(message_json)


		elif isinstance(token_object.content_object, Hotel):
			# message from hotel dashboard
			message_dict["__room_id"] = token_object.content_object.identifier
			message_dict["__reply_target"] = "dashboard"
			message_json["text"] = json.dumps(message_dict)
			# forward message to hotel's hub
			hotel_hub = token_object.content_object.hubs.first()
			hotel_hub.send_message(message_json)
		elif isinstance(token_object.content_object, Room):
			# message from guest phone
			message_dict["__room_id"] = token_object.content_object.identifier
			message_dict["__reply_target"] = token_object.content_object.identifier
			message_json["text"] = json.dumps(message_dict)
			hotel_hub = token_object.content_object.hotel.hubs.first()
			# forward message to guest room's hotel's hub
			hotel_hub.send_message(message_json)
	else:
		# invalid token or not text data found, reject connection
		message.reply_channel.send({"accept": False})


def ws_disconnect(message, token):
	token_object = get_valid_token(token)
	if token_object:
		# valid token
		group = token_object.content_object.websocket_group
		# remove reply_channel from group
		Group(group).discard(message.reply_channel)
