from django.db import models
from django.contrib.contenttypes.fields import GenericRelation

from channels import Group

# Hotel room
class Room(models.Model):
    tokens = GenericRelation('Token', related_query_name='rooms')
    name = models.CharField(max_length=128, default="")
    floor = models.CharField(max_length=128, default="")
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

    def ws_send_message(self, message):
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

    def ws_send_message(self, message):
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

    def ws_send_message(self, message):
        # send message to this hub's group (only contains this hub)
        Group(self.websocket_group).send(message)


# A Service obvect represents an available item in the list of services
# displayed on the Verboze mobile app for a certain hotel
#
class Service(models.Model):
    hotel = models.ForeignKey(Hotel, blank=True, null=True, related_name='services')

    parent = models.ForeignKey('Service', blank=True, null=True, related_name='subServices')

    title = models.CharField(max_length=64)
    subTitle = models.CharField(max_length=128)
    hoursFrom = models.TimeField(blank=True, null=True)
    hoursTo = models.TimeField(blank=True, null=True)

    def __str__(self):
        return "Service {} for {}".format(self.title, self.hotel if self.hotel != None else self.parent)

class ServiceAction(models.Model):
    service = models.ForeignKey('Service', related_name='actions')

    name = models.CharField(max_length=64)
    url = models.CharField(max_length=512)
    quantity = models.OneToOneField('ServiceActionQuantity', blank=True, null=True)
    scheduleTime = models.BooleanField()

    def __str__(self):
        return "Action: {} ({}) for {}".format(self.name, self.url, self.service)

class ServiceActionQuantity(models.Model):
    min = models.IntegerField()
    max = models.IntegerField()

    def __str__(self):
        return "{} to {}".format(self.min, self.max)
