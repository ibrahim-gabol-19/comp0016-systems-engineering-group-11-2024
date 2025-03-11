"""Application configuration for the forums app."""

from django.apps import AppConfig


class ForumsConfig(AppConfig):
    """
    Default Forums Config
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'forums'
