"""
This module contains unit tests for the 'accounts' app.
It tests the views, serializers, and signals to ensure they work as expected.
"""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, UserLoginSerializer

User = get_user_model()


class UserSerializerTest(TestCase):
    """
    Test cases for the UserSerializer.
    """

    def test_create_user(self):
        """
        Test that the UserSerializer correctly creates a new user.
        """
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123',
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpassword123'))


class UserLoginSerializerTest(TestCase):
    """
    Test cases for the UserLoginSerializer.
    """

    def setUp(self):
        """
        Set up a user for testing login functionality.
        """
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )

    def test_valid_login(self):
        """
        Test that the UserLoginSerializer validates correct credentials.
        """
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
        }
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertIn('refresh', serializer.validated_data)
        self.assertIn('access', serializer.validated_data)

    def test_invalid_login(self):
        """
        Test that the UserLoginSerializer rejects incorrect credentials.
        """
        data = {
            'username': 'testuser',
            'password': 'wrongpassword',
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)


class SignUpViewTest(TestCase):
    """
    Test cases for the SignUpView.
    """

    def setUp(self):
        """
        Set up the APIClient for testing API requests.
        """
        self.client = APIClient()

    def test_signup(self):
        """
        Test that a new user can be created via the SignUpView.
        """
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
        }
        response = self.client.post('/api/auth/signup/', data, format='json')
        print(response)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertEqual(response.data['email'], 'newuser@example.com')


class LoginViewTest(TestCase):
    """
    Test cases for the LoginView.
    """

    def setUp(self):
        """
        Set up a user and APIClient for testing login functionality.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )

    def test_login(self):
        """
        Test that a user can log in and receive JWT tokens.
        """
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
        }
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertEqual(response.data['user']['email'], 'test@example.com')


class GetUserViewTest(TestCase):
    """
    Test cases for the GetUserView.
    """

    def setUp(self):
        """
        Set up a user, APIClient, and JWT token for testing authenticated requests.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')


class SignalsTest(TestCase):
    """
    Test cases for the custom signals in the accounts app.
    """

    def test_first_user_superuser(self):
        """
        Test that the first user created is automatically made a superuser.
        """
        user = User.objects.create_user(
            username='firstuser',
            email='first@example.com',
            password='firstpassword123'
        )
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_second_user_not_superuser(self):
        """
        Test that subsequent users are not made superusers.
        """
        User.objects.create_user(
            username='firstuser',
            email='first@example.com',
            password='firstpassword123'
        )
        user2 = User.objects.create_user(
            username='seconduser',
            email='second@example.com',
            password='secondpassword123'
        )
        self.assertFalse(user2.is_superuser)
        self.assertFalse(user2.is_staff)
