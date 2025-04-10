"""Serializers for the forums application."""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import ForumPost

User = get_user_model()


class ForumPostSerializer(serializers.ModelSerializer):
    """
    Serializer for ForumPost
    """
    # Display the username of the author
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = ForumPost
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 'tags', 'media']

    def create(self, validated_data):
        """
        Create and return a new ForumPost instance, associating it with the authenticated user.
        """
        user = self.context['request'].user  # Get the authenticated user
        validated_data['author'] = user  # Set the author to the authenticated user
        return ForumPost.objects.create(**validated_data)
