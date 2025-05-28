from django.db import models
from django.contrib.auth.models import User

class Crop(models.Model):
    STATUS_CHOICES = [
        ('Planting', 'Planting'),
        ('Growing', 'Growing'),
        ('Harvesting', 'Harvesting'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crops', null=True)
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100)
    planting_date = models.DateField()
    harvest_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planting')

    def __str__(self):
        return f"{self.name} ({self.variety}) - {self.user.username if self.user else 'No User'}"

class Resource(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources', null=True)
    name = models.CharField(max_length=100)
    quantity = models.FloatField()
    type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.type}) - {self.user.username if self.user else 'No User'}"

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities', null=True)
    description = models.TextField()
    date = models.DateField()
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='activities')

    def __str__(self):
        return f"{self.description} - {self.crop.name} - {self.user.username if self.user else 'No User'}"