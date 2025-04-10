# Generated by Django 5.1.5 on 2025-02-20 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companyinformation', '0002_alter_companyinformation_latitude_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='companyinformation',
            name='latitude',
            field=models.DecimalField(decimal_places=6, max_digits=9),
        ),
        migrations.AlterField(
            model_name='companyinformation',
            name='longitude',
            field=models.DecimalField(decimal_places=6, max_digits=9),
        ),
    ]
