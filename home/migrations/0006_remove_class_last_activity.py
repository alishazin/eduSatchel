# Generated by Django 4.0.1 on 2022-01-23 03:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_class_last_activity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='class',
            name='last_activity',
        ),
    ]