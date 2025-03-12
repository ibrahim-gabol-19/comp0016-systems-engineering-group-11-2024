"""URL configurations for the likes application."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from likes.views import LikeViewSet

router = DefaultRouter()
router.register(r'', LikeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
