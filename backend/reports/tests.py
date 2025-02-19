"""
Test file for reports
"""
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Report
from .serializers import ReportSerializer

class ReportViewSetTestClass(TestCase):
    """
    Test View for Report
    """
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.report = Report.objects.create( title="Test Report",
            status="open",
            tags="environmental",
            author="John Doe",
            description="Test description",
            upvotes=0,
            latitude=40.7128,
            longitude=-74.0060)
        self.client.login(username="testuser", password="testpass")

    def test_upvote(self):
        """
        Test Upvotes
        """
        # Test the upvote functionality
        url = reverse('report-upvote', args=[self.report.id])
        response = self.client.post(url)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure upvotes have increased
        self.report.refresh_from_db()
        self.assertEqual(self.report.upvotes, 1)

        # Check the response data
        self.assertEqual(response.data, {'upvotes': 1})


class ReportSerializerTestClass(TestCase):
    """
    Report Serializer Test Class
    """

    def test_create_report(self):
        """
        Test creation of Reports
        """
        # Try to set upvotes or status manually, and check if it gets removed
        data = {
            'title': 'Test Report',
            'status': 'closed',
            'tags':'environmental',
            'author': 'John Doe',
            'description':'Test description',
            'upvotes':10,
            'latitude':40.7128,
            'longitude':-74.0060,
        }

        serializer = ReportSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        report = serializer.save()
        # Ensure that upvotes and status values from the input are ignored
        self.assertEqual(report.upvotes, 0)
        self.assertEqual(report.status, 'open')

class ReportModelTestClass(TestCase):
    """
    Test Report Model Class
    """
    def setUp(self):
        """
        Create a sample report instance for testing
        """
        self.report = Report.objects.create(
            title="Test Report",
            status="open",
            tags="environmental",
            author="John Doe",
            description="Test description",
            upvotes=10,
            latitude=40.7128,
            longitude=-74.0060
        )

    def test_report_creation(self):
        """
        Test that the Report object is created properly.
        """
        report = self.report
        self.assertEqual(report.title, "Test Report")
        self.assertEqual(report.status, "open")
        self.assertEqual(report.tags, "environmental")
        self.assertEqual(report.author, "John Doe")
        self.assertEqual(report.upvotes, 10)
        self.assertEqual(report.latitude, 40.7128)
        self.assertEqual(report.longitude, -74.0060)



    def test_tag_choices(self):
        """
        Test that tags are limited to predefined choices.
        """
        valid_tags = [tag[0] for tag in Report.TAGS_CHOICES]
        report = Report.objects.create(
            title="Test Tag Choices",
            tags="pollution",  # A valid tag
            author="Tester",
            description="Testing tag validation",
            upvotes=0,
            latitude=40.7128,
            longitude=-74.0060,
        )
        self.assertIn(report.tags, valid_tags)


    def test_status_choices(self):
        """
        Test that the status is limited to predefined choices.
        """
        valid_statuses = [status[0] for status in Report.STATUS_CHOICES]
        report = Report.objects.create(
            title="Test Status Choices",
            status="resolved",  # A valid status
            author="Tester",
            description="Testing status validation",
            upvotes=0,
            latitude=40.7128,
            longitude=-74.0060
        )
        self.assertIn(report.status, valid_statuses)



    def test_latitude_longitude(self):
        """
        Test that latitude and longitude fields accept valid decimal values.
        """
        report = Report.objects.create(
            title="GeoLocation Test",
            status="open",
            tags="road",
            author="Tester",
            description="Testing latitude and longitude",
            latitude=51.5074,
            longitude=-0.1278,
        )
        self.assertEqual(report.latitude, 51.5074)
        self.assertEqual(report.longitude, -0.1278)

    def test_str_method(self):
        """
        Test the __str__ method of the Report model.
        """
        report = self.report
        self.assertEqual(str(report), "Test Report")

    def test_published_date_auto_add(self):
        """
        Test that the published_date is automatically set upon creation.
        """
        report = Report.objects.create(
            title="Test Report",
            status="open",
            tags="environmental",
            author="John Doe",
            description="Test description",
            upvotes=10,
            latitude=40.7128,
            longitude=-74.0060
        )
        # Ensure the published_date is set to the current date
        self.assertTrue(report.published_date <= timezone.now().date())

    def test_report_upvotes_increment(self):
        """Test that upvotes can be incremented correctly."""
        report = self.report
        report.upvotes += 1
        report.save()
        self.assertEqual(report.upvotes, 11)
