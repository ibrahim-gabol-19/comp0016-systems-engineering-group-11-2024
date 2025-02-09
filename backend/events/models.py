"""
Model for Event
"""
from django.db import models

class Event(models.Model):
    """
    Event Model class for both Scheduled Events and Points of Interest
    """
    EVENT_TYPES = [
        ('scheduled', 'Scheduled Event'),
        ('point_of_interest', 'Point of Interest'),
    ]

    POI_TYPES = [
        ('landmarks', 'Landmarks'),
        ('museums', 'Museums'),
        ('parks', 'Parks'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=100)  # REQUIRED (cannot be blank)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='scheduled')
    description = models.TextField()  # REQUIRED
    main_image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    location = models.CharField(max_length=255)  # REQUIRED
    is_featured = models.BooleanField(default=False)  # Will cap at 3 on CMS frontend
    # Location Fields for both
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)

    # Fields for Scheduled Events
    date = models.DateField(null=True, blank=True)  # Will validate in serializer
    time = models.TimeField(null=True, blank=True)  # Will validate in serializer

    # Fields for Points of Interest
    opening_times = models.CharField(max_length=255, blank=True, null=True)
    poi_type = models.CharField(max_length=20, choices=POI_TYPES, blank=True, null=True)

    def __str__(self):
        return self.title