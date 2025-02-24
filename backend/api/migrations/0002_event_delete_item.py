# Generated by Django 5.1.4 on 2025-01-03 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('date_of_event', models.DateField()),
                ('time_of_event', models.TimeField()),
                ('description', models.TextField()),
                ('location', models.CharField(max_length=255)),
                ('main_image', models.ImageField(blank=True, null=True, upload_to='event_images/')),
            ],
        ),
        migrations.DeleteModel(
            name='Item',
        ),
    ]
