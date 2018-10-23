from api.models import Token, Room, Hotel, Hub, Service, ServiceAction, ServiceActionQuantity
from rest_framework import serializers

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('id', )

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
    hotel = serializers.PrimaryKeyRelatedField(queryset=Hotel.objects.all(), many=False)
    tokens = TokenSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ('id', 'name', 'floor', 'identifier', 'hotel', 'tokens',)

    def to_representation(self, obj):
        # if this serializer has hotel_object set to the hotel, it will use it instead of
        # looking up the hotel object in the DB (twice)
        if not hasattr(self, 'hotel_object'):
            self.hotel_object = obj.hotel

        ret = super(RoomSerializer, self).to_representation(obj)
        ret['hotel'] = HotelSerializer(self.hotel_object).data
        ret['token'] = ret['tokens'][0]['id'] if len(ret['tokens']) > 0 else None
        return ret


#
# Serializer for Hub Model
#
class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

    hotel = HotelSerializer()
