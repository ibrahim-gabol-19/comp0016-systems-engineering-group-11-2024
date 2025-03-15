"""Serializers for the likes application."""

from rest_framework import serializers
from likes.models import Like


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for the Like model."""
    user = serializers.SerializerMethodField()

    class Meta:
        model = Like
        fields = ['id', 'user', 'content_type', 'object_id', 'created_at']
        read_only_fields = ['user', 'created_at']

    def get_user(self, obj):
        """Return the user's id and username."""
        return {
            'id': obj.user.id,
            'username': obj.user.username
        }

    def create(self, validated_data):
        """Create a new Like instance, associating it with the authenticated user."""
        user = self.context['request'].user
        return Like.objects.create(user=user, **validated_data)
