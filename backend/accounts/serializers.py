# accounts/serializers.py

"""
This module contains serializers for user authentication, including
serializers for user creation, login, and token management.
"""

from django.contrib.auth.models import User # pylint: disable=E5142
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating user instances.
    It includes fields for username, email, and password.
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'password',"is_superuser"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Create and return a user with the given validated data.
        """
        user = User.objects.create_user(**validated_data)
        return user


class TokenSerializer(serializers.Serializer):
    """
    Serializer for handling JWT token exchange, including refresh and access tokens.
    """
    refresh = serializers.CharField()
    access = serializers.CharField()

    def create(self, validated_data):
        """
        Since TokenSerializer does not handle object creation, this method is not needed.
        """
        raise NotImplementedError("Token creation is handled through authentication.")


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login. Validates user credentials and returns JWT tokens.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validate the user's credentials and generate JWT tokens if valid.
        """
        user = User.objects.filter(username=attrs['username']).first()
        if user and user.check_password(attrs['password']):
            refresh = RefreshToken.for_user(user)
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        raise serializers.ValidationError("Invalid credentials")

    def create(self, validated_data):
        """
        Since UserLoginSerializer does not handle object creation, this method is not needed.
        """
        raise NotImplementedError("User login does not create a new object.")
