from django.db import models
from django.contrib.auth.models import User

class Crop(models.Model):
    STATUS_CHOICES = [
        ('Planting', 'Planting'),
        ('Growing', 'Growing'),
        ('Harvesting', 'Harvesting'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crops')
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100)
    planting_date = models.DateField()
    harvest_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planting')

    def __str__(self):
        return f"{self.name} ({self.variety}) - {self.user.username}"

class Resource(models.Model):
    UNIT_CHOICES = [
        ('kgs', 'Kilograms'),
        ('litres', 'Litres'),
        ('units', 'Units'),
        ('tons', 'Tons'),
        ('gallons', 'Gallons'),
    ]
    USAGE_STATUS_CHOICES = [
        ('available', 'Available'),
        ('in_use', 'In Use'),
        ('depleted', 'Depleted'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')
    name = models.CharField(max_length=100)
    quantity = models.FloatField()
    type = models.CharField(max_length=50)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, null=True, blank=True, default='units')
    usage_status = models.CharField(max_length=20, choices=USAGE_STATUS_CHOICES, default='available')

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit or 'units'}, {self.usage_status}) - {self.user.username}"

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    description = models.TextField()
    date = models.DateField()
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='activities')

    def __str__(self):
        return f"{self.description} - {self.crop.name} - {self.user.username}"

class Notification(models.Model):
    TYPE_CHOICES = [
        ('INFO', 'Information'),
        ('WARNING', 'Warning'),
        ('ALERT', 'Alert'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='INFO')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')

    def __str__(self):
        return f"{self.message} - {self.user.username} ({'Read' if self.is_read else 'Unread'})"