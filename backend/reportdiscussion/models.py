from django.db import models
from reports.models import Report  

class ReportDiscussion(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='discussions')
    author = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Discussion on {self.report.title} by {self.author}"
