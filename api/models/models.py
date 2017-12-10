from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

from .user_models import GuestUser, HotelUser, HubUser

import uuid
from channels import Group


# This model behaves identically to the default user model,
# but we’ll be able to customize it in the future if the need arises.
# It would be much more difficult to do so mid-project after initial migrations.
class User(AbstractUser):
	def __str__(self):
		if hasattr(self, 'guest_user'):
			return "[GUEST USER] {}".format(self.username)
		elif hasattr(self, 'hotel_user'):
			return "[HOTEL USER] {}".format(self.username)
		elif hasattr(self, 'hub_user'):
			return "[HUB USER] {}".format(self.username)
		else:
			return self.username


# Hotel room
class Room(models.Model):
	tokens = GenericRelation('Token', related_query_name='rooms')
	name = models.CharField(max_length=128)
	floor = models.CharField(max_length=128)
	hotel = models.ForeignKey(
		'Hotel',
		on_delete=models.CASCADE,
		related_name='rooms',
		related_query_name='room',
	)
	identifier = models.CharField(max_length=32, default="")

	class Meta:
		unique_together = ('hotel', 'identifier',)

	def __str__(self):
		return "Room {} Floor {} at {}".format(
			self.name,
			self.floor,
			self.hotel
		)

	@property
	def websocket_group(self):
		return "room-{}".format(self.id)

	def send_message(self, message):
		# send message to this room's group
		Group(self.websocket_group).send(message)


# Hotel where guest is staying in
# This will be used for hotel dashboard as well
class Hotel(models.Model):
	tokens = GenericRelation('Token', related_query_name='hotels')
	name = models.CharField(max_length=128)

	def __str__(self):
		return self.name

	@property
	def websocket_group(self):
		return "hotel-{}".format(self.id)

	def send_message(self, message):
		# send message to this hotel's group (only contains this hotel)
		Group(self.websocket_group).send(message)


# Hub central unit in hotel
class Hub(models.Model):
	tokens = GenericRelation('Token', related_query_name='hubs')
	hotel = models.ForeignKey(
		'Hotel',
		on_delete=models.CASCADE,
		related_name='hubs',
		related_query_name='hub'
	)

	def __str__(self):
		return "{}'s Hub".format(self.hotel)

	@property
	def websocket_group(self):
		return "hub-{}".format(self.id)

	def send_message(self, message):
		# send message to this hub's group (only contains this hub)
		Group(self.websocket_group).send(message)


# Token we will use to determine who is sending data
# through websockets, and establish a connection with them
#
class Token(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
	expiry = models.DateTimeField(blank=True, null=True)

	# Mandatory fields for generic relation
	# ContentType and GenericForeignKey allows Token to have a ForeignKey to
	# any of our models, in this case ForeignKey to either Hub/Guest/Dashboard
	content_type = models.ForeignKey(ContentType, blank=True, null=True)
	object_id = models.PositiveIntegerField(blank=True, null=True) # Hub/Hotel/Room object id
	content_object = GenericForeignKey('content_type', 'object_id') # Hub/Hotel/Room object

	def __str__(self):
		return "Token id={}".format(self.id)
