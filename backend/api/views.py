"""
views.py
"""

from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    """
    Viewset for handling CRUD operations on Item model.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
