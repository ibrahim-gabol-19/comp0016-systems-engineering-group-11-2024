from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ForumPost(models.Model):
    """
    Forum Post Model
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.CharField(max_length=100, blank=True, null=True)
    media = models.ImageField(upload_to='forum_media/', blank=True, null=True)

    def __str__(self):
        return self.title