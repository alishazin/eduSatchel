from django.db import models
from register.models import CustomUser

import uuid

# Create your models here.

class Class(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    # cascade will be changed in the future
    title = models.CharField(max_length=80, null=False, blank=False)
    description = models.CharField(max_length=300, null=False, blank=False)
    date_started = models.DateField(auto_now_add=True)
    active = models.BooleanField(default=True)
    # True means can enter, False means closed

