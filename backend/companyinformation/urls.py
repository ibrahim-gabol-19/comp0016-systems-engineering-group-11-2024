# CompanyInformation/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyInformationViewSet

router = DefaultRouter()
router.register(r'', CompanyInformationViewSet)  # Register the CompanyInformationViewSet with no prefix

urlpatterns = [
    path('', include(router.urls)),  # Avoid double 'CompanyInformation' in URL by using empty string
]
