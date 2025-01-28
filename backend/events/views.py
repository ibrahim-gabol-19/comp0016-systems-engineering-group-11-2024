"""
Views for events
"""

# Create your views here.
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer

class EventsViewSet(viewsets.ModelViewSet):
    """
    Events View Set
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
