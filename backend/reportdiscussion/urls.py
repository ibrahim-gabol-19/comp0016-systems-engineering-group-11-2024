# reportdiscussion/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportDiscussionViewSet

router = DefaultRouter()
router.register(r'', ReportDiscussionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
