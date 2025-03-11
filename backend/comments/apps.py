"""Application configuration for the comments app."""

from django.apps import AppConfig


class CommentsConfig(AppConfig):
    """Configuration for the Comments application."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'comments'
