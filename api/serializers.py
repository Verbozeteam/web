from api.models import Token, Room, Hotel, Hub
from rest_framework import serializers


class HotelSerializer(serializers.ModelSerializer):
    #
    # Serializer for Hotel Model
    #
    id = serializers.ReadOnlyField()

    class Meta:
        model = Hotel
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    #
    # Serializer for Room Model
    #
    id = serializers.ReadOnlyField()
    # tokens = TokenDataSerializer(many=True)

    class Meta:
        model = Room
        fields = ('id', 'name', 'floor', 'identifier',)


class HubSerializer(serializers.ModelSerializer):
    #
    # Serializer for Hub Model
    #
    id = serializers.ReadOnlyField()
    hotel = HotelSerializer()

    class Meta:
        model = Hub
        fields = '__all__'
