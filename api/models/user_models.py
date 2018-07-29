from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

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

    @property
    def websocket_group(self):
        return "hotel-{}".format(self.hotel.id)

    def ws_send_message(self, message):
        # send message to this hotel's group (only contains this hotel)
        Group(self.websocket_group).send(message)


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

    @property
    def websocket_group(self):
        return "hub-{}".format(self.hub.id)

    def ws_send_message(self, message):
        # send message to this hub's group (only contains this hub)
        Group(self.websocket_group).send(message)
