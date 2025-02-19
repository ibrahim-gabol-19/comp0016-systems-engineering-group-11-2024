# accounts/apps.py

"""
This module defines the configuration for the 'accounts' app in a Django project.
"""

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    """
    Configuration class for the 'accounts' app in a Django project.
    This class holds the app's configuration settings.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    def ready(self):
        import accounts.signals  # noqa: F401
        
        