from rest_framework import serializers
from likes.models import Like

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Like
        fields = ['id', 'user', 'content_type', 'object_id', 'created_at']
        read_only_fields = ['user', 'created_at']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username
        }

    def create(self, validated_data):
        # Get the current user from the context and assign it.
        user = self.context['request'].user
        return Like.objects.create(user=user, **validated_data)
