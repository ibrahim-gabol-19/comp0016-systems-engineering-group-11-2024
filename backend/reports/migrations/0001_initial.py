# Generated by Django 5.1.5 on 2025-01-21 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('status', models.CharField(choices=[('open', 'Open'), ('closed', 'Closed'), ('resolved', 'Resolved')], default='open', max_length=10)),
                ('main_image', models.ImageField(blank=True, null=True, upload_to='report_images/')),
                ('author', models.CharField(max_length=100)),
                ('published_date', models.DateField(auto_now_add=True)),
                ('description', models.TextField()),
                ('upvotes', models.IntegerField(default=0)),
            ],
        ),
    ]
