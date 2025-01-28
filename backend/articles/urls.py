"""
articles/urls.py
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

# Create a router and register the ArticleViewSet
router = DefaultRouter()
router.register(r'', ArticleViewSet)  # Automatically generates CRUD routes for ArticleViewSet

urlpatterns = [
    # Include the routes generated by the DefaultRouter
    path('', include(router.urls)),
]
