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
        """
        Import signals to ensure they are registered.
        This import is inside the method to prevent circular import issues.
        """
        import accounts.signals  # noqa: F401  # pylint: disable=C0415,W0611
