"""
Signals for the accounts app.

This module handles custom behavior for user creation, 
such as making the first created user a superuser.
"""

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

@receiver(post_save, sender=User)
def make_first_user_superuser(sender, instance, created, **kwargs):
    """
    Automatically sets the first created user as a superuser.

    Args:
        _sender: The model class (unused).
        instance: The instance of the User being saved.
        created: A boolean indicating whether a new record was created.
        **kwargs: Additional keyword arguments.
    """
    
    if created:  # Only runs when a new user is created
        if User.objects.count() == 1:  # Check if it's the first user
            instance.is_superuser = True
            instance.is_staff = True
            instance.save()  # Save changes to the user
            print("First user is now a superuser.")
