from django.db import models

class Report(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('resolved', 'Resolved'),
    ]
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    # tags = models.ManyToManyField('Tag', blank=True)
    main_image = models.ImageField(upload_to='report_images/', blank=True, null=True)
    author = models.CharField(max_length=100)
    published_date = models.DateField(auto_now_add=True)
    description = models.TextField()
    upvotes = models.IntegerField(default=0)  # Upvote count

    def __str__(self):
        return self.title
