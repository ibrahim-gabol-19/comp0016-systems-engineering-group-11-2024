from django.contrib import admin
from likes.models import Like

class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'content_type', 'object_id', 'created_at')
    list_filter = ('user', 'content_type', 'created_at')
    search_fields = ('user__username',)

admin.site.register(Like, LikeAdmin)
