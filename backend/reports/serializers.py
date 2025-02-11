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
        """
        Override the create method to ensure the first report is always 'open'
        """
        # Ensure the 'status' is set to 'open' during creation if it's not provided
        validated_data.setdefault('status', 'open')
        validated_data.setdefault('upvotes', 0)  # Default value for upvotes, if not provided

        return super().create(validated_data)

    def validate(self, attrs):
        """
        Do not remove 'status' for PATCH requests, but allow it to be set only on creation.
        """
        if self.instance is None:  # Ensure this only applies to creation
            attrs.setdefault('status', 'open')
            attrs.setdefault('upvotes', 0)  
            # Ignore user-provided upvotes and status values during validation
            attrs.pop('upvotes', None)
            attrs.pop('status', None)  # Don't allow users to override 'status' during creation
            
        return attrs
