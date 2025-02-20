# company/serializers.py

from rest_framework import serializers
from .models import CompanyInformation

class CompanyInformationSerializer(serializers.ModelSerializer):
    """
    Serializer for CompanyInformation
    """
    class Meta:
        model = CompanyInformation
        fields = '__all__'  
