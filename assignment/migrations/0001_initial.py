# Generated by Django 4.0.1 on 2022-06-26 20:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('classmenu', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True, null=True)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('assignment_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classmenu.assignment')),
                ('files', models.ManyToManyField(blank=True, to='classmenu.File')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('urls', models.ManyToManyField(blank=True, to='classmenu.Url')),
            ],
        ),
        migrations.CreateModel(
            name='Correction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True, null=True)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('given_marks', models.DecimalField(decimal_places=2, max_digits=6)),
                ('submission_obj', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assignment.submission')),
            ],
        ),
    ]
