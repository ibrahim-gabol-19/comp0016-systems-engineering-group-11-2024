from django.contrib import admin
from .models import Comment

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'content_type', 'object_id', 'created_at')
    list_filter = ('author', 'content_type', 'created_at')
    search_fields = ('content', 'author__username')

admin.site.register(Comment, CommentAdmin)
