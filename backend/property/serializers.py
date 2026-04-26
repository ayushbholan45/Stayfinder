from rest_framework import serializers
from .models import Property, Reservation, Review, PropertyImage
from useraccount.serializers import UserDetailSerializer

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image_url', 'order')

class PropertiesListSerializer(serializers.ModelSerializer):
    landlord = UserDetailSerializer(read_only=True, many=False)
    images = PropertyImageSerializer(read_only=True, many=True)

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'price_per_night',
            'image_url',
            'images',
            'landlord',
        )

class PropertiesDetailSerializer(serializers.ModelSerializer):
    landlord = UserDetailSerializer(read_only=True, many=False)
    images = PropertyImageSerializer(read_only=True, many=True)

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'description',
            'price_per_night',
            'image_url',
            'images',
            'bedrooms',
            'bathrooms',
            'guests',
            'landlord'
        )

class ReservationsListSerializer(serializers.ModelSerializer):
    property = PropertiesListSerializer(read_only=True, many=False)

    class Meta:
        model = Reservation
        fields = (
            'id', 'start_date', 'end_date', 'number_of_nights', 'total_price', 'property'
        )

class ReviewSerializer(serializers.ModelSerializer):
    created_by = UserDetailSerializer(read_only=True, many=False)

    class Meta:
        model = Review
        fields = (
            'id', 'rating', 'comment', 'created_by', 'created_at'
        )