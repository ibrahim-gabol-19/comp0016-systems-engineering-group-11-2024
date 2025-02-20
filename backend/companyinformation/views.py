# companyinformation/views.py

from rest_framework import viewsets
from .models import CompanyInformation
from .serializers import CompanyInformationSerializer

class CompanyInformationViewSet(viewsets.ModelViewSet):
    """
    CompanyInformation View Set
    """
    queryset = CompanyInformation.objects.all()  
    serializer_class = CompanyInformationSerializer
