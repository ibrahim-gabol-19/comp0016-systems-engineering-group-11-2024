# Generated by Django 5.1.5 on 2025-01-30 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_alter_event_main_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='event_type',
            field=models.CharField(choices=[('scheduled', 'Scheduled Event'), ('point_of_interest', 'Point of Interest')], default='scheduled', max_length=20),
        ),
        migrations.AddField(
            model_name='event',
            name='is_featured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='event',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='opening_times',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='poi_type',
            field=models.CharField(blank=True, choices=[('landmark', 'Landmark'), ('museum', 'Museum'), ('park', 'Park'), ('other', 'Other')], max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='location',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
