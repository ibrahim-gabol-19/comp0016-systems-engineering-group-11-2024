from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ForumPost
from .serializers import ForumPostSerializer

class ForumPostViewSet(viewsets.ModelViewSet):
    """
    Forum Post View Set
    """
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can create/modify posts

    def perform_create(self, serializer):
        """
        Automatically set the author to the authenticated user when creating a post.
        """
        serializer.save(author=self.request.user)
