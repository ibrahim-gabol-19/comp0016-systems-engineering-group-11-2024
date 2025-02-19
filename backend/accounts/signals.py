from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

@receiver(post_save, sender=User)
def make_first_user_superuser(sender, instance, created, **kwargs):
    if created:  # Only runs when a new user is created
        if User.objects.count() == 1:  # Check if it's the first user
            instance.is_superuser = True
            instance.is_staff = True
            instance.save()  # Save changes to the user
            print("First user is now a superuser.")
