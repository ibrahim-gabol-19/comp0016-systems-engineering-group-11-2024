from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet

router = DefaultRouter()
router.register(r'', ForumPostViewSet)  # Register without the 'forums' prefix

urlpatterns = [
    path('', include(router.urls)),  # This will avoid double 'forums' in the URL
]