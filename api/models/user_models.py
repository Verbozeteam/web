from django.db import models
from django.conf import settings


class GuestUser(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='guest_user'
	)

	def __str__(self):
		return '[GUEST USER] {} {}'.format(
			self.user.first_name,
			self.user.last_name
		)


class HotelUser(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='hotel_user'
	)
	hotel = models.ForeignKey(
		'api.Hotel',
		on_delete=models.CASCADE,
		related_name='users',
		null=True,
		default=None
	)

	def __str__(self):
		return '[HOTEL USER] {} {}'.format(
			self.user.first_name,
			self.user.last_name
		)


class HubUser(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='hub_user'
	)
	hub = models.OneToOneField(
		'api.Hub',
		on_delete=models.CASCADE,
		related_name='hub_user',
		null=True,
		default=None
	)

	def __str__(self):
		return '[HUB USER] {} {}'.format(
			self.user.first_name,
			self.user.last_name
		)
