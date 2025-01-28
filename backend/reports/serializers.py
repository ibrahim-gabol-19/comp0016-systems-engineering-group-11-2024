"""
reports serializer
"""
from rest_framework import serializers
from reportdiscussion.serializers import ReportDiscussionSerializer
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    """
    Report Serializer
    """
    discussions = ReportDiscussionSerializer(many=True, read_only=True)

    class Meta:
        """
        Meta Class
        """
        model = Report
        fields = '__all__'

    def create(self, validated_data):
        # Ensure upvotes is set to 0 and status to 'open' if they are not provided
        validated_data.setdefault('upvotes', 0)
        validated_data.setdefault('status', 'open')

        return super().create(validated_data)

    def validate(self, attrs):
        # Ignore user-provided upvotes and status values
        attrs.pop('upvotes', None)
        attrs.pop('status', None)
        return attrs
