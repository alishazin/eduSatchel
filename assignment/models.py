from register.models import CustomUser
from django.db import models
from classmenu.models import Assignment, File, Url

# Create your models here.

class Submission(models.Model):
    assignment_obj = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    message = models.TextField(null=True, blank=True)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    files = models.ManyToManyField(File, blank=True)
    urls = models.ManyToManyField(Url, blank=True)