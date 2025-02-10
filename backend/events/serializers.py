"""
Event serializer
"""
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Event serializer
    """
    class Meta:
        """
        Event serializer Meta
        """
        model = Event
        fields = '__all__'

    # def validate(self, data):
    #     """
    #     Custom validation to enforce required fields based on event type.
    #     """
    #     event_type = data.get('event_type')

    #     # Common required fields
    #     if not data.get('title'):
    #         raise serializers.ValidationError({"title": "This field is required."})
    #     if not data.get('description'):
    #         raise serializers.ValidationError({"description": "This field is required."})
    #     if not data.get('location'):
    #         raise serializers.ValidationError({"location": "This field is required."})

    #     # Required fields for Scheduled Events
    #     if event_type == 'scheduled':
    #         if not data.get('date'):
    #             raise serializers.ValidationError({"date": "This field is required for scheduled events."})
    #         if not data.get('time'):
    #             raise serializers.ValidationError({"time": "This field is required for scheduled events."})

    #     # Required fields for POIs
    #     if event_type == 'point_of_interest':
    #         if not data.get('poi_type'):
    #             raise serializers.ValidationError({"poi_type": "This field is required for POIs."})
    #         if not data.get('opening_times'):
    #             raise serializers.ValidationError({"opening_times": "This field is required for POIs."})

    #     return data