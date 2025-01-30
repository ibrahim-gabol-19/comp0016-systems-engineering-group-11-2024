"""
This module defines the AppConfig for the 'api' app.
"""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    """
    Api Config
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
