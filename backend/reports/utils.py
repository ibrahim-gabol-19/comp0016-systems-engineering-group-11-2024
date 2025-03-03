"""
reports/utils.py
"""
from .models import Report
from .serializers import ReportSerializer

def get_reports():
    """
    Retrieve all reports.
    """
    reports = Report.objects.all()
    serializer = ReportSerializer(reports, many=True)
    return serializer.data
