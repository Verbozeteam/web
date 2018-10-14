from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# This model behaves identically to the default user model,
# but we’ll be able to customize it in the future if the need arises.
# It would be much more difficult to do so mid-project after initial migrations.
class User(AbstractUser):
    @property
    def types(self):
        user_types = []
        if hasattr(self, 'admin_user'):
            user_types.append('admin_user')
        if hasattr(self, 'guest_user'):
            user_types.append('guest_user')
        if hasattr(self, 'hotel_user'):
            user_types.append('hotel_user')
        if hasattr(self, 'hub_user'):
            user_types.append('hub_user')
        return user_types

    def __str__(self):
        user_types = self.types
        user_types = list(map(lambda user_type: user_type.replace('_', ' ').upper(), user_types))

        if len(user_types) == 0:
            return self.username
        else:
            return self.username + ' -> ' + str(user_types)


class AdminUser(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='admin_user'
    )

    def __str__(self):
        return '[ADMIN USER] {}'.format(
            self.user.username
        )

    @property
    def websocket_group(self):
        return 'admin-{}'.format(self.id)

    def ws_send_message(self, message):
        # send message to this admin's group (only contains this admin)
        Group(self.websocket_group).send(message)

class GuestUser(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='guest_user'
    )

    def __str__(self):
        return '[GUEST USER] {}'.format(
            self.user.username
        )

    @property
    def websocket_group(self):
        return 'guest-{}'.format(self.id)

    def ws_send_message(self, message):
        # send message to this guest's group (only contains this guest)
        Group(self.websocket_group).send(message)


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
        return '[HOTEL USER] {}'.format(
            self.user.username,
        )

    @property
    def websocket_group(self):
        return 'hotel-{}'.format(self.hotel.id)

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
        return '[HUB USER] {}'.format(
            self.user.username
        )

    @property
    def websocket_group(self):
        return 'hub-{}'.format(self.hub.id)

    def ws_send_message(self, message):
        # send message to this hub's group (only contains this hub)
        Group(self.websocket_group).send(message)
