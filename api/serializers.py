from api.models import Token, Room, Hotel, Hub
from rest_framework import serializers


class ContentObjectField(serializers.RelatedField):
    #
    # A custom field to use for the `token` generic relationship.
    #
    def to_representation(self, value):
        #
        # Serialize room instances using a room serializer
        # Serialize hotel instance using hotel serilizer
        # Serilizee hub instance using hub serilizer
        #
        if isinstance(value, Room):
            serializer = RoomSerializer(value)
        elif isinstance(value, Hotel):
            serializer = HotelSerializer(value)
        elif isinstance(value, Hub):
            serializer = HubSerializer(value)
        else:
            raise Exception('Unexpected type of tagged object')

        return serializer.data


class TokenSerializer(serializers.ModelSerializer):
    #
    # Serializer for Token with nested content_object:
    #   - Room
    #   - Hotel
    #   - Hub
    #
    id = serializers.ReadOnlyField()
    content_object = ContentObjectField(queryset=Token.objects.all())

    class Meta:
        model = Token
        fields = '__all__'


class TokenDataSerializer(serializers.ModelSerializer):
    #
    # Serializer for Token data only:
    #   - id
    #   - expired
    #
    id = serializers.ReadOnlyField()

    class Meta:
        model = Token
        fields = ('id', 'expired',)


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
    tokens = TokenDataSerializer(many=True)

    class Meta:
        model = Room
        fields = ('id', 'name', 'floor', 'tokens',)


class HubSerializer(serializers.ModelSerializer):
    #
    # Serializer for Hub Model
    #
    id = serializers.ReadOnlyField()
    hotel = HotelSerializer()

    class Meta:
        model = Hub
        fields = '__all__'
