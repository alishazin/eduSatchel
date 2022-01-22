from django.db import models
from register.models import CustomUser

import uuid

# Create your models here.

# all the cascades will be changed in the future

class Class(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=80, null=False, blank=False)
    description = models.CharField(max_length=300, null=False, blank=False)
    date_started = models.DateField(auto_now_add=True)
    active = models.BooleanField(default=True)
    # True means can enter, False means closed

    def __str__(self):
        return f'<{self.title}> By <{self.teacher}>'

class ClassEnrollment(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    enrolled = models.BooleanField(default=False)
    # enrolled will be False when sending join request, it will be made True
    # when teacher accepts it.
    # class will be shown up on home screen only if enrolled is True

    def __str__(self):
        return f'<{self.student}> In <{self.class_obj}>'
