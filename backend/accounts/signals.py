"""
Signals for the accounts app.

This module handles custom behavior for user creation, 
such as making the first created user a superuser.
"""

from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver

User = get_user_model()


@receiver(post_save, sender=User)
def make_first_user_superuser(sender, instance, created, **kwargs):  # pylint: disable=W0613
    """
    Automatically sets the first created user as a superuser.

    Args:
        sender: The model class (required for signal handling).
        instance: The instance of the User being saved.
        created: A boolean indicating whether a new record was created.
        **kwargs: Additional keyword arguments.
    """

    if created and User.objects.count() == 1:
        instance.is_superuser = True
        instance.is_staff = True
        instance.save()
        print("First user is now a superuser.")
