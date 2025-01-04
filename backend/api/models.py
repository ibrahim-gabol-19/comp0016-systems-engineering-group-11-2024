from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=255)
    date_of_event = models.DateField()
    time_of_event = models.TimeField()
    description = models.TextField()
    location = models.CharField(max_length=255)
    main_image = models.ImageField(upload_to='event_images/', blank=True, null=True)

    def __str__(self):
        return self.title
