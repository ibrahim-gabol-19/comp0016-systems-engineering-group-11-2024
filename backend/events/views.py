"""
Views for events
"""

from rest_framework import viewsets
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import action



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
    
    @action(detail=False, methods=['get'])
    def pois(self, request):
        pois = Event.objects.filter(event_type="point_of_interest").values("title", "opening_times", "description", "poi_type", "main_image")
        poi_dict = {}

        for poi in pois:
            category = poi["poi_type"] or "Other"
            if category not in poi_dict:
                poi_dict[category] = []
            poi_dict[category].append({
                "title": poi["title"],
                "openTimes": poi["opening_times"] or "No opening hours available",
                "description": poi["description"],
                "image": poi["main_image"] or "https://picsum.photos/950",
                "category": category
            })

        return Response(poi_dict)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_events = Event.objects.filter(is_featured=True).values(
            "title", "opening_times", "description", "main_image", "event_type"
        )
        featured_event_list = [
            {
                "title": event["title"],
                "openTimes": event["opening_times"] or "N/A",
                "description": event["description"],
                "image": event["main_image"] or "https://picsum.photos/550",
                "event_type": event["event_type"]
            }
            for event in featured_events
        ]
        return Response(featured_event_list)
