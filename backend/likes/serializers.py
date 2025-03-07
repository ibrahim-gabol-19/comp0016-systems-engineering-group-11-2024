from rest_framework import serializers
from likes.models import Like
from django.contrib.contenttypes.models import ContentType

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'content_type', 'object_id', 'created_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        # Get the current user from the context and assign it.
        user = self.context['request'].user
        return Like.objects.create(user=user, **validated_data)
