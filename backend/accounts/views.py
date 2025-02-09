# accounts/views.py

"""
This module contains views for user authentication, including sign-up and login.
The views use serializers to handle user creation and login logic.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, UserLoginSerializer


class SignUpView(APIView):
    """
    View to handle user sign-up.
    Allows users to create an account by providing username, email, and password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST requests for user sign-up.
        Validates the incoming data and creates a new user if the data is valid.
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    """
    View to handle user login.
    Allows users to log in by providing their username and password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST requests for user login.
        Validates the user's credentials and returns authentication tokens if valid.
        """
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=200)
        return Response(serializer.errors, status=400)
