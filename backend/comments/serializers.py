"""Serializers for the comments application."""

from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for the Comment model."""
    author = serializers.ReadOnlyField(source='author.username')
    like_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    # Accept generic fields from the frontend
    content_type = serializers.CharField(write_only=True)
    object_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'content',
            'author',
            'content_type',
            'object_id',
            'parent_comment',
            'created_at',
            'updated_at',
            'likes',
            'like_count',
            'replies'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'likes']

    def get_like_count(self, obj):
        """Return the like count for the comment."""
        return obj.like_count()

    def get_replies(self, obj):
        """Return serialized replies for the comment."""
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data

    def create(self, validated_data):
        """Create a new Comment instance."""
        request_data = self.context['request'].data
        user = self.context['request'].user
        validated_data['author'] = user

        # Convert content_type string (e.g. "forums.forumpost") to a ContentType instance
        content_type_str = validated_data.pop('content_type')
        try:
            app_label, model = content_type_str.split('.')
            ct = ContentType.objects.get(app_label=app_label, model=model)
        except Exception as exc:
            raise serializers.ValidationError(
                "Invalid content_type format. Expected 'app_label.model'."
            ) from exc
        validated_data['content_type'] = ct

        # If a reply is being made, map the frontend's "reply_to" field to parent_comment
        reply_to = request_data.get('reply_to')
        if reply_to:
            validated_data['parent_comment_id'] = reply_to

        return Comment.objects.create(**validated_data)
