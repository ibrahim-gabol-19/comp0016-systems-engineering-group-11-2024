from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, upload_pdf

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')

urlpatterns = [
    path('upload/', upload_pdf, name='upload_pdf'),
    path('', include(router.urls)),
]
