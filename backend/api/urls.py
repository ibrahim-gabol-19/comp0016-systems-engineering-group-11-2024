from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import ItemViewSet, upload_pdf, upload_article_pdf

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')

urlpatterns = [
    path('upload/', upload_pdf, name='upload_pdf'),
    path('upload-article/', upload_article_pdf, name='upload_article_pdf'),
    path('upload-event-pdf/', upload_pdf, name='upload_event_pdf'),
    path('', include(router.urls)),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
