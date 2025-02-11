from django.db import models

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    main_image = models.ImageField(upload_to='event_images/', blank=True, null=True)

    def __str__(self):
        return self.title
