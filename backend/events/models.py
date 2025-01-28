
from django.db import models

class Event(models.Model):
    title=models.CharField(max_length=100)
    date=models.DateField()
    time=models.TimeField()
    description = models.TextField()
    main_image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name
