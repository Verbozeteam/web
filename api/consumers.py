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
			__room_names = message_dict.get("__room_names")
			if __room_names:
				# forward to hotel dashboard
				dashboard_message_json = {}
				dashboard_message_json["text"] = message_text
				hotel_dashboard = token_object.content_object.hotel
				hotel_dashboard.send_message(dashboard_message_json)

				# remove room names from message before sending to room
				del message_dict["__room_names"]
				message_json["text"] = json.dumps(message_dict)

				# check validity of room name before forwarding to guest room
				for room_name in __room_names:
					try:
						room = Room.objects.get(name=room_name, hotel=token_object.content_object.hotel)
						room.send_message(message_json)
					except Room.DoesNotExist:
						# invalid room name provided, don't do anything
						pass


		elif isinstance(token_object.content_object, Hotel):
			# message from hotel dashboard
			# adding sender information to message, ("[name_of_hotel] dashboard" in this case)
			message_dict["__room_name"] = token_object.content_object.name + " dashboard"
			message_json["text"] = json.dumps(message_dict)
			# forward message to hotel's hub
			hotel_hub = token_object.content_object.hubs.first()
			hotel_hub.send_message(message_json)
		else:
			# message from guest room
			# adding sender information to message, ("[room_number]" in this case)
			message_dict["__room_name"] = token_object.content_object.name
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
