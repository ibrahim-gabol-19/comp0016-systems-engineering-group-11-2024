from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from likes.models import Like
from likes.serializers import LikeSerializer
from django.contrib.contenttypes.models import ContentType

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # Validate that content_type and object_id are provided.
        if not data.get('content_type') or not data.get('object_id'):
            return Response(
                {"error": "Both 'content_type' and 'object_id' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Convert content_type string (e.g. "forums.forumpost") to a ContentType instance.
        try:
            app_label, model = data['content_type'].split('.')
            ct = ContentType.objects.get(app_label=app_label, model=model)
        except Exception:
            return Response(
                {"error": "Invalid content_type format. Expected 'app_label.model'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Replace content_type field with the id of the ContentType instance.
        data['content_type'] = ct.id

        serializer = self.get_serializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()  # The create() method in the serializer assigns user.
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
