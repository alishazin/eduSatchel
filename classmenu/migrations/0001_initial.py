# Generated by Django 4.0.1 on 2022-06-28 09:30

import classmenu.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(max_length=500, upload_to=classmenu.models.get_file_upload_location)),
                ('format', models.CharField(max_length=100, null=True)),
                ('location_hint', models.CharField(choices=[('public', 'Public'), ('assignment', 'Assignment'), ('response', 'Response')], max_length=10)),
                ('class_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.class')),
            ],
        ),
        migrations.CreateModel(
            name='Poll',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('closed', models.BooleanField(default=False)),
                ('class_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.class')),
            ],
        ),
        migrations.CreateModel(
            name='Url',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='PollOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=300)),
                ('poll_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classmenu.poll')),
            ],
        ),
        migrations.CreateModel(
            name='PolledDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('poll_option_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classmenu.polloption')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MessagePublic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=300)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('class_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.class')),
                ('files', models.ManyToManyField(blank=True, to='classmenu.File')),
                ('urls', models.ManyToManyField(blank=True, to='classmenu.Url')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('date_due', models.DateTimeField(blank=True, null=True)),
                ('total_marks', models.DecimalField(decimal_places=2, max_digits=6)),
                ('class_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.class')),
                ('files', models.ManyToManyField(blank=True, to='classmenu.File')),
                ('urls', models.ManyToManyField(blank=True, to='classmenu.Url')),
            ],
        ),
    ]
