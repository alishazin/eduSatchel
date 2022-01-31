# Generated by Django 4.0.1 on 2022-01-31 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classmenu', '0003_alter_file_location_hint'),
    ]

    operations = [
        migrations.CreateModel(
            name='Url',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='messagepublic',
            name='url',
            field=models.ManyToManyField(to='classmenu.Url'),
        ),
    ]
