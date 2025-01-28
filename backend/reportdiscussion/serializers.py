"""
Serializer
"""
from rest_framework import serializers
from .models import ReportDiscussion

class ReportDiscussionSerializer(serializers.ModelSerializer):
    """
    Report Discussion Serializer
    """
    class Meta:
        """
        Meta Serializer
        """
        model = ReportDiscussion
        fields = '__all__'
