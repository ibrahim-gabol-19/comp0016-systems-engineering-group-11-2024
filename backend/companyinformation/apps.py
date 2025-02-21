"""
This module contains the configuration for the 'companyinformation' app.
It defines the CompanyinformationConfig class, which specifies the 
default auto field and the app name for the 'companyinformation' app in Django.
"""

from django.apps import AppConfig

class CompanyinformationConfig(AppConfig):
    """
    Configuration for the 'companyinformation' app.
    
    This class defines the default auto field type and the name of the 
    application in the Django project.
    """

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'companyinformation'
