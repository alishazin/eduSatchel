# Generated by Django 4.0.1 on 2022-02-05 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classmenu', '0013_alter_assignment_total_marks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='content',
            field=models.TextField(),
        ),
    ]
