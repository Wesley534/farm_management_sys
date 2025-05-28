
from django.db import models

class Crop(models.Model):
    STATUS_CHOICES = [
        ('Planting', 'Planting'),
        ('Growing', 'Growing'),
        ('Harvesting', 'Harvesting'),
    ]
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100)
    planting_date = models.DateField()
    harvest_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planting')

    def __str__(self):
        return f"{self.name} ({self.variety})"

class Resource(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.FloatField()  # Changed to FloatField for decimal quantities
    type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.type})"

class Activity(models.Model):
    description = models.TextField()
    date = models.DateField()
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='activities')

    def __str__(self):
        return f"{self.description} - {self.crop.name}"
