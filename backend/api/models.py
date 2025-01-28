"""
This module contains the models for the API, including the Item model.
"""
from django.db import models

class Item(models.Model):
    """
    Item Model
    """
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
