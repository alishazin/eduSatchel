from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from base64 import b64encode

import uuid

ACCOUNT_TYPES = (
    ('student','Student'),
    ('teacher', 'Teacher'),
)
def get_image_upload_location(self, filename):
    format = ''
    reversedStr = filename[::-1]
    for i in range(len(reversedStr)):
        if reversedStr[i] == '.':
            format = reversedStr[0 : i]
            break
    return f"profile/{self.image_storage_id}/image.{format[::-1]}"

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password, account_type):
        if not email:
            raise ValueError("User must have an email address.")
        if not username:
            raise ValueError("User must have a username.")
        if not account_type:
            raise ValueError("User must have a account_type.")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            account_type=account_type,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password, account_type):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
            account_type=account_type,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.is_email_verified = True
        user.save(using=self._db)
        return user

# Create your models here.

class CustomUser(AbstractBaseUser):

    email = models.EmailField(verbose_name='email', max_length=254, unique=True) 
    username = models.CharField(max_length=30, unique=False)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True) 
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=True) 
    is_staff = models.BooleanField(default=False) 
    is_superuser = models.BooleanField(default=False) 
    account_type = models.CharField(max_length=7, choices=ACCOUNT_TYPES, blank=False, null=False)
    profile_pic = models.ImageField(blank=True, upload_to=get_image_upload_location, default='profile/default.jpg')
    bio = models.TextField(max_length=300, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    image_storage_id = models.UUIDField(default=uuid.uuid4, editable=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'account_type']

    def __str__(self):
        return f'{self.email} <{self.account_type}>'

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def profile_pic_path(self):
        return f'/media/{self.profile_pic}'