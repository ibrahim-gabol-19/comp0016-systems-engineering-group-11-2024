"""
events/utils.py
"""
from .models import Event
from .serializers import EventSerializer

def get_events():
    """
    Retrieve all events.
    """
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return serializer.data
