"""
Views for events
"""
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from .models import Event
from .serializers import EventSerializer



class EventsViewSet(viewsets.ModelViewSet):
    """
    Viewset for Events
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def list(self, request, *args, **kwargs):
        """
        For the /events/ endpoint
        """
        events = Event.objects.values(
            "id", "title", "event_type", "description", "main_image", 
            "location", "longitude", "latitude",
            "date", "time", "opening_times", "poi_type", "is_featured"
        )

        event_list = []
        for event in events:
            # Generate the full media URL dynamically
            main_image_url = (
                request.build_absolute_uri(settings.MEDIA_URL + event['main_image'])
                if event["main_image"]
                else "https://picsum.photos/550"
            )

            event_data = {
                "id": event["id"],
                "title": event["title"],
                "event_type": event["event_type"],
                "description": event["description"],
                "main_image": main_image_url,
                "location": event["location"],
                "longitude": event["longitude"],
                "latitude": event["latitude"],
                "is_featured": event["is_featured"],
            }

            if event["event_type"] == "scheduled":
                event_data.update({
                    "date": event["date"],
                    "time": event["time"]
                })
            elif event["event_type"] == "point_of_interest":
                event_data.update({
                    "opening_times": event["opening_times"],
                    "poi_type": event["poi_type"]
                })

            event_list.append(event_data)

        return Response(event_list)

    @action(detail=False, methods=['get'])
    def scheduled(self, request):
        """
        For the /events/scheduled/ endpoint
        """
        events = Event.objects.all().values("id", "title",
                                            "date", "time", "description", "location")
        event_dict = {}

        for event in events:
            # Check if the event has a date, and handle cases where it's None
            if event["date"]:
                date_str = event["date"].strftime("%Y-%m-%d")
            else:
                date_str = ""  # Or any default value you want

            # Handle missing or None time
            if event["time"]:
                time_str = event["time"].strftime("%H:%M") 
            else:
                time_str = ""  # Default for missing time

            if date_str not in event_dict:
                event_dict[date_str] = []
            event_dict[date_str].append({
                "id": event["id"],
                "time": time_str,
                "title": event["title"],
                "description": event["description"],
                "location": event["location"]
            })
        return Response(event_dict)

    @action(detail=False, methods=['get'])
    def pois(self, request):
        """
        For the /events/pois/ endpoint
        """
        pois = Event.objects.filter(event_type="point_of_interest").values(
            "id", "title", "opening_times", "description", "poi_type", "main_image"
        )
        poi_dict = {}

        for poi in pois:
            # Generate the full media URL dynamically
            main_image_url = (
                request.build_absolute_uri(settings.MEDIA_URL + poi['main_image'])
                if poi["main_image"]
                else "https://picsum.photos/550"
            )

            category = poi["poi_type"] or "Other"
            if category not in poi_dict:
                poi_dict[category] = []

            poi_dict[category].append({
                "id": poi["id"],
                "title": poi["title"],
                "openTimes": poi["opening_times"] or "No opening hours available",
                "description": poi["description"],
                "main_image": main_image_url,
                "category": category
            })

        return Response(poi_dict)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        For the /events/featured/ endpoint
        """
        featured_events = Event.objects.filter(is_featured=True).values(
            "id", "title", "opening_times", "description", "main_image", 
            "event_type", "location", "date", "time"
        )

        featured_event_list = [
            {
                "id": event["id"],
                "title": event["title"],
                "openTimes": event["opening_times"] or "N/A",
                "description": event["description"],
                "main_image": (
                    request.build_absolute_uri(settings.MEDIA_URL + event['main_image'])
                    if event["main_image"]
                    else "https://picsum.photos/550"
                ),
                "eventType": event["event_type"],
                "location": event["location"],
                "date": event["date"].strftime("%Y-%m-%d") if event["date"] else None,
                "time": event["time"].strftime("%I:%M %p") if event["time"] else None,
            }
            for event in featured_events
        ]

        return Response(featured_event_list)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        For the /events/search/ endpoint
        """
        events = Event.objects.values(
            "title", "event_type", "description", "location",
            "date", "time", "opening_times", "poi_type", "is_featured"
        )

        event_list = [
            {
                "title": event["title"],
                "event_type": event["event_type"],
                "description": event["description"],
                "location": event["location"],
                "is_featured": event["is_featured"],
                **(
                    {  # Fields for Scheduled Events
                        "date": event["date"],
                        "time": event["time"]
                    }
                    if event["event_type"] == "scheduled" else  # Only include for scheduled events
                    {  # Fields for POIs
                        "opening_times": event["opening_times"] or "N/A",
                        "poi_type": event["poi_type"]
                    }
                    if event["event_type"] == "poi" else {}  # Only include for POIs
                )
            }
            for event in events
        ]

        return Response(event_list)
