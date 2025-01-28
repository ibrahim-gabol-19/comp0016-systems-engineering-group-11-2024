"""
apps.py for articles
"""
from django.apps import AppConfig


class ApiConfig(AppConfig):
    """
    Default API Config
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'articles'
