from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import ForumPost
from rest_framework.test import APIClient

User = get_user_model()

class ForumPostTests(APITestCase):
    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  # Force authentication

        # Create a forum post for testing
        self.forum_post = ForumPost.objects.create(
            title='Test Post',
            content='This is a test post.',
            author=self.user
        )

    def test_create_forum_post(self):
        """
        Ensure we can create a new forum post.
        """
        url = reverse('forumpost-list')  # Adjust the URL name as per your URL configuration
        data = {
            'title': 'New Test Post',
            'content': 'This is a new test post.',
            'tags': 'test, new',
            'media': None  # Assuming no media is uploaded for this test
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ForumPost.objects.count(), 2)  # One existing post + new post
        self.assertEqual(ForumPost.objects.get(id=response.data['id']).title, 'New Test Post')

    def test_create_forum_post_unauthenticated(self):
        """
        Ensure that unauthenticated users cannot create a forum post.
        """
        self.client.logout()  # Log out the user
        url = reverse('forumpost-list')  # Adjust the URL name as per your URL configuration
        data = {
            'title': 'New Test Post',
            'content': 'This is a new test post.',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_forum_post_detail(self):
        """
        Ensure we can retrieve a forum post.
        """
        url = reverse('forumpost-detail', args=[self.forum_post.id])  # Adjust the URL name as per your URL configuration
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.forum_post.title)

    def test_update_forum_post(self):
        """
        Ensure we can update an existing forum post.
        """
        url = reverse('forumpost-detail', args=[self.forum_post.id])  # Adjust the URL name as per your URL configuration
        data = {
            'title': 'Updated Test Post',
            'content': 'This is an updated test post.',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.forum_post.refresh_from_db()
        self.assertEqual(self.forum_post.title, 'Updated Test Post')

    def test_delete_forum_post(self):
        """
        Ensure we can delete a forum post.
        """
        url = reverse('forumpost-detail', args=[self.forum_post.id])  # Adjust the URL name as per your URL configuration
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ForumPost.objects.count(), 0)  # Ensure the post is deleted
