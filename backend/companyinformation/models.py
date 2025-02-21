"""
This module defines the CompanyInformation model, which stores information about the company.
It enforces a singleton pattern to ensure that only one entry can exist in the database.
"""

from django.db import models

class CompanyInformation(models.Model):
    """
    Company Model to store information about the company.
    This model is designed to enforce a singleton pattern, ensuring
    only one entry exists in the database.
    """
    name = models.CharField(max_length=200)
    about = models.TextField()
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    main_color = models.CharField(max_length=7)  # Hex code for color (e.g., '#FF5733')
    font = models.CharField(max_length=100)  # Font name (e.g., 'Arial')

    # Map boundary information
    sw_lat = models.DecimalField(max_digits=9, decimal_places=6)  # southwest latitude
    sw_lon = models.DecimalField(max_digits=9, decimal_places=6)  # southwest longitude
    ne_lat = models.DecimalField(max_digits=9, decimal_places=6)  # northeast latitude
    ne_lon = models.DecimalField(max_digits=9, decimal_places=6)  # northeast longitude

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """
        Ensure there is only one instance of this model in the database.
        """
        if not self.pk and CompanyInformation.objects.exists():
            raise ValueError("Only one instance of CompanyInformation can exist.")
        super().save(*args, **kwargs)
