from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from likes.models import Like
from likes.serializers import LikeSerializer
from django.contrib.contenttypes.models import ContentType

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()  # Added queryset attribute for router compatibility.
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Override the queryset to filter likes based on query parameters:
        - content_type: A string in the format 'app_label.model'
        - object_id: The id of the object being liked
        """
        queryset = Like.objects.all()
        content_type_param = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        if content_type_param and object_id:
            try:
                app_label, model = content_type_param.split('.')
                ct = ContentType.objects.get(app_label=app_label, model=model)
                queryset = queryset.filter(content_type=ct, object_id=object_id)
            except Exception:
                # If filtering fails, return an empty queryset.
                queryset = Like.objects.none()
        return queryset

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
        serializer.save()  # The create() method in the serializer assigns the user.
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
