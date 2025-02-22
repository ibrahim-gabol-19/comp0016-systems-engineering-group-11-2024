"""
This module defines the URL routing for the CompanyInformation app.
It registers the CompanyInformationViewSet with a DefaultRouter to automatically
generate the necessary URLs for API endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyInformationViewSet

router = DefaultRouter()
# Register the CompanyInformationViewSet with no prefix
router.register(r'', CompanyInformationViewSet)

urlpatterns = [
    # Avoid double 'CompanyInformation' in URL by using empty string
    path('', include(router.urls)),
]
