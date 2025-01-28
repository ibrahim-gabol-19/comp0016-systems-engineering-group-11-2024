"""
This module contains serializers for the API, including the ItemSerializer.
"""

from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the Item model, used to convert Item instances to JSON and vice versa.
    """
    class Meta:
        model = Item
        fields = '__all__'
