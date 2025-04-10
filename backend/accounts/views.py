"""
This module contains views for user authentication, including sign-up and login.
The views use serializers to handle user creation and login logic.
"""

from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from .serializers import UserSerializer, UserLoginSerializer

User = get_user_model()


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
            user = serializer.save()
            return Response({
                "username": user.username,
                "email": user.email,
                "is_superuser": user.is_superuser
            }, status=201)
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
            user = User.objects.get(username=request.data['username'])
            return Response({
                "refresh": serializer.validated_data['refresh'],
                "access": serializer.validated_data['access'],
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "is_superuser": user.is_superuser
                }
            }, status=200)
        return Response(serializer.errors, status=400)


class GetUserView(APIView):
    """
    Retrieve authenticated user details, including is_superuser.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET requests to retrieve the authenticated user's details.
        """
        user = request.user
        return Response({
            "id": user.id,  
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
Retrieve the currently authenticated user's information.

This view returns the ID and username of the user making the request.
It requires the user to be authenticated.

Permissions:
    - IsAuthenticated: Only authenticated users can access this view.

HTTP Methods:
    - GET: Retrieve the current user's information.

Returns:
    Response: A JSON response containing the user's ID and username.
"""
    return Response({
        "id": request.user.id, 
        "username": request.user.username
    })
