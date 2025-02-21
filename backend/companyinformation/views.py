from rest_framework import viewsets
from .models import CompanyInformation
from .serializers import CompanyInformationSerializer

class CompanyInformationViewSet(viewsets.ModelViewSet):
    """
    CompanyInformation View Set
    """
    queryset = CompanyInformation.objects.all()
    serializer_class = CompanyInformationSerializer

def create_default_company():
    # Check if the company information exists
    if not CompanyInformation.objects.exists():
        # Create an example company if it doesn't exist
        CompanyInformation.objects.create(
            name="Example Company",
            about="This is an example company. It's just a placeholder.",
            logo=None,  # You can leave it as None or add a default image if available
            main_color="#FF5733",  # Hex color code example
            font="Arial",  # Default font
            sw_lat=34.052235,  # Example latitude for SW corner
            sw_lon=-118.243683,  # Example longitude for SW corner
            ne_lat=34.052255,  # Example latitude for NE corner
            ne_lon=-118.243600,  # Example longitude for NE corner
        )

# Call the function to create the default company when the application starts
create_default_company()
