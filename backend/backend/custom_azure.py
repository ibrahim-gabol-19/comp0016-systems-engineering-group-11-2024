""""
backend/custom_azure.py
"""
from storages.backends.azure_storage import AzureStorage


class AzureMediaStorage(AzureStorage): # pylint: disable=W0223
    """
    This class sets up the azure media container to upload user images to.
    """
    account_name = 'storagesysengblob'
    account_key = (
        'account key here'
    )
    azure_container = 'media'
    expiration_secs = None
