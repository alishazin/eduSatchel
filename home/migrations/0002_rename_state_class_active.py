# Generated by Django 4.0.1 on 2022-01-22 09:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='class',
            old_name='state',
            new_name='active',
        ),
    ]
