# Generated by Django 4.0.1 on 2022-01-22 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_classenrollment'),
    ]

    operations = [
        migrations.AddField(
            model_name='classenrollment',
            name='enrolled',
            field=models.BooleanField(default=False),
        ),
    ]
