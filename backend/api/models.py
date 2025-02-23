"""
This module defines the models for the API application.
"""

from django.db import models


class Item(models.Model):
    """
    Represents an item with a name, description, location, and optional main image.
    """

    name = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    main_image = models.ImageField(upload_to='event_images/', blank=True, null=True)

    def __str__(self):
        """
        Returns a string representation of the item, which is its name.
        """
        return self.name
