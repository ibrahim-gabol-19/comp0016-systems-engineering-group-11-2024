"""Views for the comments application."""

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for handling Comment operations."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return filtered queryset based on content_type and object_id query parameters."""
        queryset = super().get_queryset()
        # Filter using generic fields: expect both content_type and object_id as query params
        content_type_str = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        if content_type_str and object_id:
            try:
                app_label, model = content_type_str.split('.')
                ct = ContentType.objects.get(app_label=app_label, model=model)
                queryset = queryset.filter(content_type=ct, object_id=object_id)
            except (ValueError, ContentType.DoesNotExist):
                queryset = queryset.none()
        else:
            queryset = queryset.none()
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new Comment instance."""
        data = request.data.copy()
        if not data.get('object_id') or not data.get('content_type'):
            return Response(
                {"error": "Both 'object_id' and 'content_type' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Uses our custom create() in the serializer
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, _pk=None):
        """Add a like from the current user to the comment."""
        comment = self.get_object()
        user = request.user
        comment.likes.add(user)
        return Response({'status': 'liked', 'like_count': comment.like_count()})
