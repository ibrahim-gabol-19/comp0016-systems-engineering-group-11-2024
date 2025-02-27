from rest_framework import serializers
from .models import Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    like_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    post_id = serializers.IntegerField(write_only=True)  # Add this line

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'post_id', 'parent_comment', 'created_at', 'updated_at', 'likes', 'like_count', 'replies']
        read_only_fields = ['author', 'created_at', 'updated_at', 'likes']

    def get_like_count(self, obj):
        return obj.like_count()

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['author'] = user
        return Comment.objects.create(**validated_data)