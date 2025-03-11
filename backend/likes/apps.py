"""Application configuration for the likes app."""

from django.apps import AppConfig


class LikesConfig(AppConfig):
    """Configuration for the likes application."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'likes'
