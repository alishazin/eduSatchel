# Generated by Django 4.0.1 on 2023-03-02 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0005_alter_customuser_portal_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_pic',
            field=models.URLField(blank=True, null=True),
        ),
    ]
