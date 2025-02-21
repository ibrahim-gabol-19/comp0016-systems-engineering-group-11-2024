"""
api/urls.py
"""

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, upload_pdf_and_extract_data, upload_ics_and_extract_event_data

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')

urlpatterns = [
    path('upload/<str:pdf_type>/', upload_pdf_and_extract_data, name='upload_pdf_and_extract_data'),
    path('upload_ics/', upload_ics_and_extract_event_data, name='upload_ics'),
    path('', include(router.urls)),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
