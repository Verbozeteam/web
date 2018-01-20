from api.models import Token, Room, Hotel, Hub, Service, ServiceAction, ServiceActionQuantity
from rest_framework import serializers


class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class ServiceActionQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceActionQuantity
        fields = '__all__'

class ServiceActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAction
        fields = ('name', 'url', 'quantity', 'scheduleTime')

    quantity = ServiceActionQuantitySerializer()

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('subServices', 'title', 'subTitle', 'hoursFrom', 'hoursTo', 'actions')

    subServices = RecursiveSerializer(many=True)
    actions = ServiceActionSerializer(many=True)

#
# Serializer for Hotel Model
#
class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

    services = ServiceSerializer(many=True)

#
# Serializer for Room Model
#
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'floor', 'identifier',)


#
# Serializer for Hub Model
#
class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

    hotel = HotelSerializer()
