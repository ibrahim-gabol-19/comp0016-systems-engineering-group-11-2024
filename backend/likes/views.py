"""Views for the likes application."""

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from likes.models import Like
from likes.serializers import LikeSerializer
from rest_framework.decorators import action
from rest_framework.views import APIView

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Like.objects.all()
        content_type_param = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        if content_type_param and object_id:
            try:
                app_label, model = content_type_param.split('.')
                ct = ContentType.objects.get(app_label=app_label, model=model)
                queryset = queryset.filter(content_type=ct, object_id=object_id)
            except (ValueError, ContentType.DoesNotExist):
                queryset = Like.objects.none()
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('content_type') or not data.get('object_id'):
            return Response(
                {"error": "Both 'content_type' and 'object_id' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            app_label, model = data['content_type'].split('.')
            ct = ContentType.objects.get(app_label=app_label, model=model)
        except (ValueError, ContentType.DoesNotExist):
            return Response(
                {"error": "Invalid content_type format. Expected 'app_label.model'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data['content_type'] = ct.id
        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["delete"], url_path="unlike")
    def unlike(self, request):
        """Delete a like via content_type and object_id (custom route)."""
        user = request.user
        content_type_param = request.query_params.get("content_type")
        object_id = request.query_params.get("object_id")

        if not content_type_param or not object_id:
            return Response(
                {"error": "Both 'content_type' and 'object_id' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            app_label, model = content_type_param.split(".")
            ct = ContentType.objects.get(app_label=app_label, model=model)
            like = Like.objects.get(user=user, content_type=ct, object_id=object_id)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (ValueError, ContentType.DoesNotExist, Like.DoesNotExist):
            return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)
