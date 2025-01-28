from rest_framework import viewsets
from .models import ReportDiscussion
from .serializers import ReportDiscussionSerializer

class ReportDiscussionViewSet(viewsets.ModelViewSet):
    queryset = ReportDiscussion.objects.all()
    serializer_class = ReportDiscussionSerializer
