from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Crop, Activity, Notification
from datetime import datetime, timedelta

@receiver(post_save, sender=Crop)
def create_harvest_notification(sender, instance, created, **kwargs):
    print(f"Signal triggered for crop {instance.name}, harvest_date={instance.harvest_date}")  # Debug
    today = datetime.now().date()
    threshold = today + timedelta(days=7)
    
    # Check if harvest date is within 7 days
    if instance.harvest_date and today <= instance.harvest_date <= threshold:
        days_until_harvest = (instance.harvest_date - today).days
        message = f"Your crop {instance.name} ({instance.variety}) is due for harvest in {days_until_harvest} day(s) on {instance.harvest_date}."
        
        # Prevent duplicate notifications
        existing_notification = Notification.objects.filter(
            user=instance.user,
            crop=instance,
            message=message,
            is_read=False
        ).exists()
        
        if not existing_notification:
            print(f"Creating crop notification: {message}")  # Debug
            Notification.objects.create(
                user=instance.user,
                message=message,
                type='ALERT',
                crop=instance
            )

@receiver(post_save, sender=Activity)
def create_activity_notification(sender, instance, created, **kwargs):
    print(f"Signal triggered for activity {instance.description}, date={instance.date}")  # Debug
    today = datetime.now().date()
    threshold = today + timedelta(days=7)
    
    # Check if activity date is within 7 days
    if instance.date and today <= instance.date <= threshold:
        days_until_due = (instance.date - today).days
        crop_name = instance.crop.name if instance.crop else "No crop"
        message = f"Activity '{instance.description}' for {crop_name} is due in {days_until_due} day(s) on {instance.date}."
        
        # Prevent duplicate notifications
        existing_notification = Notification.objects.filter(
            user=instance.user,
            crop=instance.crop,
            message=message,
            is_read=False
        ).exists()
        
        if not existing_notification:
            print(f"Creating activity notification: {message}")  # Debug
            Notification.objects.create(
                user=instance.user,
                message=message,
                type='ALERT',
                crop=instance.crop
            )