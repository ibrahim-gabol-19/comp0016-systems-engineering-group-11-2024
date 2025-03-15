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
        'Rh5HvgVgGZiGG/DggJ0RBD1/mTDAqmN+P5uwwWQH+ZEFTzmfGyjcTXXvRGedomyX4ZuGccfM3833+'
        'AStk3lzfw=='
    )
    azure_container = 'media'
    expiration_secs = None
