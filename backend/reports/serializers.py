from rest_framework import serializers
from .models import Report
from reportdiscussion.serializers import ReportDiscussionSerializer
class ReportSerializer(serializers.ModelSerializer):
    discussions = ReportDiscussionSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = '__all__'

    def create(self, validated_data):
            # Ensure upvotes is set to 0 and status to 'open' if they are not provided
            validated_data.setdefault('upvotes', 0)
            validated_data.setdefault('status', 'open')
            
            return super().create(validated_data)

    def validate(self, data):
        # Ignore user-provided upvotes and status values
        data.pop('upvotes', None)
        data.pop('status', None)
        return data