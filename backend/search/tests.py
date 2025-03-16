from django.test import TestCase, Client
from django.urls import reverse
from articles.models import Article
from events.models import Event
from reports.models import Report
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from datetime import date, time


User = get_user_model()
class SearchViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  # Force authentication
        self.article = Article.objects.create(
        title='Test Article',
        author='Test Author',
        description='This is a test article.',
        content='This is the content of the test article.')
        self.event = Event.objects.create(
        title="Summer Music Festival",
        event_type="scheduled",
        description="A large music festival featuring multiple bands and artists.",
        location="Central Park, New York",
        is_featured=True,
        longitude=-73.9857,
        latitude=40.7484,
        date=date(2025, 6, 15),
        time=time(18, 0),
        )
        self.report = Report.objects.create(
            title="Pollution in Central Park",
            status="open",
            tags="pollution",
            main_image=None,  # Assuming there is no image for the report
            author="John Doe",
            description="The pollution levels in Central Park are rising due to increased foot traffic and litter.",
            upvotes=50,
            latitude=40.7851,
            longitude=-73.9683,
        )

    def test_search_with_valid_query(self):
        # Assuming you have a URL pattern for the search view
        response = self.client.get(reverse('search'), {'query': 'example query'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())

    def test_search_with_empty_query(self):
        response = self.client.get(reverse('search'), {'query': ''})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "Please provide a query."})

    def test_search_with_no_data(self):
        # You may need to ensure that your data retrieval functions return empty lists
        response = self.client.get(reverse('search'), {'query': 'some query'})
        self.assertEqual(response.status_code, 200)

