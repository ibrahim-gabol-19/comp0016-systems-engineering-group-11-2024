from storages.backends.azure_storage import AzureStorage


class AzureMediaStorage(AzureStorage):
    account_name = 'storagesysengblob' # Must be replaced by your <storage_account_name>
    account_key = 'Rh5HvgVgGZiGG/DggJ0RBD1/mTDAqmN+P5uwwWQH+ZEFTzmfGyjcTXXvRGedomyX4ZuGccfM3833+AStk3lzfw==' # Must be replaced by your <storage_account_key>
    azure_container = 'media'
    expiration_secs = None
