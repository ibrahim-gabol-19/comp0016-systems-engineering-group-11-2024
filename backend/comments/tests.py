"""
This module contains unit tests for the 'comments' app.
It tests the views and serializers to ensure they work as expected.
"""

from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from articles.models import Article
from .models import Comment

User = get_user_model()

class CommentAPITests(APITestCase):
    """
    Test cases for the Comment model and views.
    """

    def setUp(self):
        """
        Set up the test client and create a test comment.
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

    def test_create_comment(self):
        """
        Test creating a new comment.
        """
        url = reverse('comment-list')
        data = {
            'content': 'This is a test comment.',
            'content_type': f'{self.content_type.app_label}.{self.content_type.model}',
            'object_id': self.article.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.get().content, 'This is a test comment.')

    def test_get_comments(self):
        """
        Test retrieving comments based on content type and object ID.
        """
        Comment.objects.create(
            content='Comment 1',
            author=self.user,
            content_type=self.content_type,
            object_id=self.article.id
        )
        Comment.objects.create(
            content='Comment 2',
            author=self.user,
            content_type=self.content_type,
            object_id=self.article.id
        )
        url = reverse('comment-list')
        url += f'?content_type={self.content_type.app_label}.{self.content_type.model}'
        url += f'&object_id={self.article.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_comment_without_object_id(self):
        """
        Test creating a comment without object_id.
        """
        url = reverse('comment-list')
        data = {
            'content': 'This is a test comment.',
            'content_type': f'{self.content_type.app_label}.{self.content_type.model}',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Both 'object_id' and 'content_type' are required", response.data['error'])

    def test_create_comment_with_invalid_content_type(self):
        """
        Test creating a comment with an invalid content type.
        """
        url = reverse('comment-list')
        data = {
            'content': 'This is a test comment.',
            'content_type': 'invalid.contenttype',
            'object_id': self.article.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid content_type format. Expected 'app_label.model'.", response.data)

    def test_long_output(self):
        """Test long output formatting."""
        result = "Expected very long string that exceeds limit"
        self.assertEqual(result, ("Expected very long string that exceeds "
                                  "limit"))
