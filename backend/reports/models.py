from django.db import models

class Report(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('resolved', 'Resolved'),
    ]
    TAGS_CHOICES = [
        ('environmental', 'Environmental'),
        ('road', 'Road'),
        ('pollution', 'Pollution'),
        ('wildlife_conservation', 'Wildlife Conservation'),
        ('climate_change', 'Climate Change'),
        ('waste_management', 'Waste Management'),
        ('health_safety', 'Health & Safety'),
        ('urban_development', 'Urban Development'),
    ]

    title = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    tags = models.CharField(max_length=30, choices=TAGS_CHOICES, default='environmental')
    main_image = models.ImageField(upload_to='report_images/', blank=True, null=True)
    author = models.CharField(max_length=100)
    published_date = models.DateField(auto_now_add=True)
    description = models.TextField()
    upvotes = models.IntegerField(default=0)  
    
    
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True)  
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True)  

    def __str__(self):
        return self.title
