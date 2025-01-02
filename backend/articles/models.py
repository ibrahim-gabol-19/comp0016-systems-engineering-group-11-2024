from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    main_image = models.ImageField(upload_to='article_images/', blank=True, null=True)
    author = models.CharField(max_length=100)
    published_date = models.DateField(auto_now_add=True)
    description = models.TextField()
    content = models.TextField()

    def __str__(self):
        return self.title