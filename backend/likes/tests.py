"""
This module contains unit tests for the 'likes' app.
It tests the views and serializers to ensure they work as expected.
"""

from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from articles.models import Article
from likes.models import Like

User = get_user_model()

class LikeAPITests(APITestCase):
    """
    Test cases for the Like model and views.
    """

    def setUp(self):
        """
        Set up the test client and create a test like.
        """
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.content_type = ContentType.objects.get(app_label='articles', model='article')
        self.article = Article.objects.create(
            title='Test Article',
            author='Test Author',
            description='This is a test article.',
            content='This is the content of the test article.'
        )

    def test_create_like(self):
        """
        Test creating a new like.
        """
        url = reverse('like-list')
        data = {
            'content_type': f'{self.content_type.app_label}.{self.content_type.model}',
            'object_id': self.article.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 1)
        self.assertEqual(Like.objects.get().user.username, 'testuser')
        self.assertEqual(Like.objects.get().content_object, self.article)
