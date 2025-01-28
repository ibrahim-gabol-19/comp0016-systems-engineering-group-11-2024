# from django.test import TestCase
# from .models import Report

# class ReportModelTest(TestCase):

#     def setUp(self):
#         self.report = Report.objects.create(
#             title="Test Report",
#             status="open",
#             tags="environmental",
#             author="Test Author",
#             description="This is a test report description."
#         )

#     def test_report_creation(self):
#         report = self.report
#         self.assertEqual(report.title, "Test Report")
#         self.assertEqual(report.status, "open")
#         self.assertEqual(report.tags, "environmental")
#         self.assertEqual(report.author, "Test Author")
#         self.assertEqual(report.description, "This is a test report description.")

#     def test_upvote_increments(self):
#         report = self.report
#         initial_upvotes = report.upvotes
#         report.upvotes += 1
#         report.save()
#         self.assertEqual(report.upvotes, initial_upvotes + 1)

# from rest_framework.exceptions import ValidationError
# from rest_framework.test import APITestCase
# from .models import Report
# from .serializers import ReportSerializer

# class ReportSerializerTest(APITestCase):

#     def setUp(self):
#         self.report = Report.objects.create(
#             title="Test Report",
#             status="open",
#             tags="environmental",
#             author="Test Author",
#             description="This is a test report description.",
#             latitude=Decimal('51.5074'),  # Example latitude (London)
#             longitude=Decimal('0.1278')  # Example longitude (London)
#         )

#     def test_report_serializer(self):
#         serializer = ReportSerializer(self.report)
#         data = serializer.data

#         self.assertEqual(data['title'], "Test Report")
#         self.assertEqual(data['status'], "open")
#         self.assertEqual(data['tags'], "environmental")
#         self.assertEqual(data['author'], "Test Author")
#         self.assertEqual(data['description'], "This is a test report description.")

#     def test_invalid_report_data(self):
#         # Test invalid status (should raise validation error)
#         invalid_data = {
#             "title": "Invalid Report",
#             "status": "invalid_status",  # Invalid status
#             "tags": "environmental",
#             "author": "Invalid Author",
#             "description": "This should raise an error."
#         }
#         serializer = ReportSerializer(data=invalid_data)
#         self.assertFalse(serializer.is_valid())
#         self.assertIn("status", serializer.errors)


# from rest_framework.test import APITestCase
# from rest_framework import status
# from .models import Report

# class ReportViewSetTest(APITestCase):

#     def setUp(self):
#         self.report = Report.objects.create(
#             title="Test Report",
#             status="open",
#             tags="environmental",
#             author="Test Author",
#             description="This is a test report description."
#         )

#     def test_get_reports(self):
#         response = self.client.get('/reports/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)

#     def test_upvote_report(self):
#         url = f'/reports/{self.report.id}/upvote/'  # Assuming this is the correct URL
#         response = self.client.post(url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['upvotes'], self.report.upvotes + 1)

#     def test_upvote_invalid_report(self):
#         url = '/reports/999/upvote/'  # Non-existing report ID
#         response = self.client.post(url)
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
