# Generated by Django 4.0.1 on 2022-02-05 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classmenu', '0010_alter_assignment_date_due'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='date_due',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
