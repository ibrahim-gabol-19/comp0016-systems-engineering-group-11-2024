"""
This module defines the URL patterns for user authentication,
including sign-up and login views.
"""

from django.urls import path
from .views import SignUpView, LoginView, GetUserView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', GetUserView.as_view(), name='get-user'),
]
