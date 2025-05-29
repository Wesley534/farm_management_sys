from rest_framework import serializers
from .models import Crop, Resource, Activity, Notification
from django.contrib.auth.models import User

class CropSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Crop
        fields = ['id', 'user', 'name', 'variety', 'planting_date', 'harvest_date', 'status']

    def validate(self, data):
        if not data.get('name') or not data.get('variety'):
            raise serializers.ValidationError("Name and variety are required.")
        if data.get('planting_date') >= data.get('harvest_date'):
            raise serializers.ValidationError("Harvest date must be after planting date.")
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ResourceSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Resource
        fields = ['id', 'user', 'name', 'quantity', 'type', 'unit', 'usage_status']

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

    def validate_unit(self, value):
        if value not in [choice[0] for choice in Resource.UNIT_CHOICES]:
            raise serializers.ValidationError("Invalid unit.")
        return value

    def validate_usage_status(self, value):
        if value not in [choice[0] for choice in Resource.USAGE_STATUS_CHOICES]:
            raise serializers.ValidationError("Invalid usage status.")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ActivitySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    crop = CropSerializer(read_only=True)
    crop_id = serializers.PrimaryKeyRelatedField(
        queryset=Crop.objects.none(), source='crop', write_only=True
    )

    class Meta:
        model = Activity
        fields = ['id', 'user', 'description', 'date', 'crop', 'crop_id']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context.get('request'):
            user = self.context['request'].user
            self.fields['crop_id'].queryset = Crop.objects.filter(user=user)

    def validate(self, data):
        if not data.get('description'):
            raise serializers.ValidationError("Description is required.")
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    crop = CropSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'type', 'is_read', 'created_at', 'crop']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)