from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet

router = DefaultRouter()
router.register(r'', CommentViewSet)  # Register without the 'comments' prefix

urlpatterns = [
    path('', include(router.urls)),  # This will avoid double 'comments' in the URL
]