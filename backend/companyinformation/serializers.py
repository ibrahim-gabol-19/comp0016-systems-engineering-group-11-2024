"""
This module defines the serializer for the CompanyInformation model.
It provides a way to convert CompanyInformation instances into JSON format
and vice versa.
"""

from rest_framework import serializers
from .models import CompanyInformation

class CompanyInformationSerializer(serializers.ModelSerializer):
    """
    Serializer for CompanyInformation
    """
    class Meta:
        model = CompanyInformation
        fields = '__all__'
