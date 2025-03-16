from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Comment
from articles.models import Article
from django.contrib.contenttypes.models import ContentType
from rest_framework.test import APIClient
User = get_user_model()

class CommentAPITests(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  # Force authentication

        # Create a sample content type for testing
        self.content_type = ContentType.objects.get(app_label='articles', model='article')
        # Create a sample article for testing
        self.article = Article.objects.create(
            title='Test Article',
            author='Test Author',
            description='This is a test article.',
            content='This is the content of the test article.'
        )

    def test_create_comment(self):
        """Test creating a new comment."""
        url = reverse('comment-list')  # Adjust the URL name as necessary
        data = {
            'content': 'This is a test comment.',
            'content_type': f'{self.content_type.app_label}.{self.content_type.model}',
            'object_id': self.article.id,  # Use the article's ID
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.get().content, 'This is a test comment.')

    
    def test_get_comments(self):
        """Test retrieving comments based on content type and object ID."""
        comment1 = Comment.objects.create(
            content='Comment 1',
            author=self.user,
            content_type=self.content_type,
            object_id=self.article.id  # Use the article's ID
        )
        comment2 = Comment.objects.create(
            content='Comment 2',
            author=self.user,
            content_type=self.content_type,
            object_id=self.article.id  # Use the article's ID
        )
        url = reverse('comment-list') + f'?content_type={self.content_type.app_label}.{self.content_type.model}&object_id={self.article.id}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return both comments

    def test_create_comment_without_object_id(self):
        """Test creating a comment without object_id."""
        url = reverse('comment-list')  # Ensure the URL name is correct
        data = {
            'content': 'This is a test comment.',
            'content_type': f'{self.content_type.app_label}.{self.content_type.model}',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Both 'object_id' and 'content_type' are required", response.data['error'])

    def test_create_comment_with_invalid_content_type(self):
        """Test creating a comment with an invalid content type."""
        url = reverse('comment-list')  # Ensure the URL name is correct
        data = {
            'content': 'This is a test comment.',
            'content_type': 'invalid.contenttype',
            'object_id': self.article.id,  # Use the article's ID
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid content_type format. Expected 'app_label.model'.", response.data)