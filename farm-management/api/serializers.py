
from rest_framework import serializers
from .models import Crop, Resource, Activity

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ['id', 'name', 'variety', 'planting_date', 'harvest_date', 'status']

    def validate(self, data):
        if not data.get('name') or not data.get('variety'):
            raise serializers.ValidationError("Name and variety are required.")
        if data.get('planting_date') >= data.get('harvest_date'):
            raise serializers.ValidationError("Harvest date must be after planting date.")
        return data

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'quantity', 'type']

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'description', 'date', 'crop']

    def validate(self, data):
        if not data.get('description'):
            raise serializers.ValidationError("Description is required.")
        return data
