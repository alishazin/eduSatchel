# Generated by Django 4.0.1 on 2022-06-28 09:30

from django.db import migrations, models
import register.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email')),
                ('username', models.CharField(max_length=30)),
                ('date_joined', models.DateTimeField(auto_now_add=True, verbose_name='date joined')),
                ('last_login', models.DateTimeField(auto_now=True, verbose_name='last login')),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('account_type', models.CharField(choices=[('student', 'Student'), ('teacher', 'Teacher')], max_length=7)),
                ('profile_pic', models.ImageField(blank=True, default='profile/default.jpg', upload_to=register.models.get_image_upload_location)),
                ('bio', models.TextField(blank=True, max_length=300, null=True)),
                ('is_email_verified', models.BooleanField(default=False)),
                ('image_storage_id', models.UUIDField(default=uuid.uuid4, editable=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
