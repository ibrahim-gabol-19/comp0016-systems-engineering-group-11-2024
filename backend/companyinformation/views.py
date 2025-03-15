"""
This module contains the view sets and utility functions for managing the 
CompanyInformation model. It provides the logic to handle the company data 
and includes a method to create a default company if no company information exists.
"""

from django.db import OperationalError
from rest_framework import viewsets
from .models import CompanyInformation
from .serializers import CompanyInformationSerializer

class CompanyInformationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing CompanyInformation instances.
    """
    queryset = CompanyInformation.objects.all()
    serializer_class = CompanyInformationSerializer

def create_default_company():
    """
    Creates a default company if none exists in the database.
    
    This function checks if any CompanyInformation instances exist and, if not, 
    creates a default company with predefined attributes such as name, about, 
    color, font, and geographic boundaries.
    """
    try:
        if not CompanyInformation.objects.exists():
            # Create an example company if it doesn't exist
            CompanyInformation.objects.create(
                name="Example Company",
                about="This is an example company. It's just a placeholder.",
                logo=None,  # You can leave it as None or add a default image if available
                main_color="#FF5733",  # Hex color code example
                font="Arial",  # Default font
                sw_lat = 51.341875,  # Example latitude for SW corner
                sw_lon = -0.29222,  # Example longitude for SW corner
                ne_lat = 51.651675,  # Example latitude for NE corner
                ne_lon = 0.01758,  # Example longitude for NE corner
            )
    except OperationalError:
        # The table doesn't exist yet, skip creating the default company
        pass

# Call the function to create the default company when the application starts
create_default_company()
