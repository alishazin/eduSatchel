# Generated by Django 4.0.1 on 2022-02-05 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classmenu', '0006_assignment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='date_due',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]