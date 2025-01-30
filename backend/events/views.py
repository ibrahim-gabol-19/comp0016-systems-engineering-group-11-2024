"""
Views for events
"""

from rest_framework import viewsets
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer


class EventsViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def list(self, request):
        events = Event.objects.all().values("title", "date", "time", "description")
        event_dict = {}

        for event in events:
            # Check if the event has a date, and handle cases where it's None
            if event["date"]:
                date_str = event["date"].strftime("%Y-%m-%d")
            else:
                date_str = ""  # Or any default value you want

            # Handle missing or None time
            if event["time"]:
                time_str = event["time"].strftime("%I:%M %p")  # Convert to 12-hour format
            else:
                time_str = ""  # Default for missing time

            if date_str not in event_dict:
                event_dict[date_str] = []
            event_dict[date_str].append({
                "time": time_str,
                "title": event["title"],
                "description": event["description"],
            })

        return Response(event_dict)
