from django.db import models
from .hotel_models import Hub, Hotel, Room

from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

import uuid

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

    def get_hotel(self):
        if isinstance(self.content_object, HubUser):
            return self.content_object.hub.hotel
        elif isinstance(self.content_object, HotelUser):
            return self.content_object.hotel
        elif isinstance(self.content_object, Room):
            self.content_object.hotel
        return None
