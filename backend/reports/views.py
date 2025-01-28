"""
view.py for reports
"""
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Report
from .serializers import ReportSerializer

class ReportViewSet(viewsets.ModelViewSet):
    """
    Report View Set
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    @action(detail=True, methods=['post'])
    def upvote(self, request ):
        """
        Handle upvotes endpoint
        """
        report = self.get_object()
        report.upvotes += 1
        report.save()
        return Response({'upvotes': report.upvotes}, status=status.HTTP_200_OK)
