from rest_framework import serializers
from .models import ReportDiscussion

class ReportDiscussionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportDiscussion
        fields = '__all__'
