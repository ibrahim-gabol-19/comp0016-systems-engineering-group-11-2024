# articles/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

router = DefaultRouter()
router.register(r'', ArticleViewSet)  # Register without the 'articles' prefix

urlpatterns = [
    path('', include(router.urls)),  # This will avoid double 'articles' in the URL
]