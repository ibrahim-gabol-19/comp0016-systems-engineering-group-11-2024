from rest_framework import serializers
from .models import Report
from reportdiscussion.serializers import ReportDiscussionSerializer
class ReportSerializer(serializers.ModelSerializer):
    discussions = ReportDiscussionSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
