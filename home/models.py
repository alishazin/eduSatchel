from django.db import models
from django.urls import reverse
from register.models import CustomUser
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

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

    def __str__(self):
        return f'{self.id} <{self.title}>'

    @property
    def get_url(self):
        return reverse('classmenu:class', kwargs={'classID' : self.id})

    @property
    def get_url_settings(self):
        return reverse('classmenu:settings', kwargs={'classID' : self.id})

    @property
    def get_url_assignments(self):
        return reverse('classmenu:assignments', kwargs={'classID' : self.id})

    @property
    def get_url_add_poll(self):
        return reverse('classmenu:add-poll', kwargs={'classID' : self.id})

    @property
    def get_url_add_assignment(self):
        return reverse('classmenu:add-assignment', kwargs={'classID' : self.id})

    @property
    def formatted_date(self):
        from .backends import check_if_today_or_yesterday
        return check_if_today_or_yesterday(self.date_started)

    @property
    def get_join_requests(self):
        return self.classenrollment_set.filter(enrolled=False)

    @property
    def total_enrolled_students(self):
        return len(self.classenrollment_set.filter(enrolled=True))

    def get_enrolled_students(self):
        return self.classenrollment_set.filter(enrolled=True)

class ClassEnrollment(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    enrolled = models.BooleanField(default=False)
    # enrolled will be False when sending join request, it will be made True
    # when teacher accepts it.
    # class will be shown up on home screen only if enrolled is True

    @property
    def encoded_id(self):
        return urlsafe_base64_encode(force_bytes(self.id))

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    header = models.CharField(max_length=80, null=False, blank=False)
    body = models.TextField(null=False, blank=False)
    seen = models.BooleanField(default=False)
    time = models.DateTimeField(auto_now_add=True)