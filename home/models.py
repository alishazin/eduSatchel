from django.db import models
from register.models import CustomUser

import uuid

# Create your models here.

class Class(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=80, null=False, blank=False)
    description = models.CharField(max_length=300, null=False, blank=False)
    date_started = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    # True means can enter, False means closed

    @property
    def get_url(self):
        return f'/class/{self.id}/'

    @property
    def formatted_date(self):
        from .backends import check_if_today_or_yesterday
        return check_if_today_or_yesterday(self.date_started)

class ClassEnrollment(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    enrolled = models.BooleanField(default=False)
    # enrolled will be False when sending join request, it will be made True
    # when teacher accepts it.
    # class will be shown up on home screen only if enrolled is True

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    header = models.CharField(max_length=80, null=False, blank=False)
    body = models.TextField(null=False, blank=False)
    seen = models.BooleanField(default=False)
    time = models.DateTimeField(auto_now_add=True)