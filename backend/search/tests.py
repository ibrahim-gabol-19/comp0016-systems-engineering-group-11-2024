from django.test import TestCase, Client
from django.urls import reverse
from articles.models import Article
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

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
        content='This is the content of the test article.'
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

