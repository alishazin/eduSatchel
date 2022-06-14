from register.models import CustomUser
from django.db import models
from classmenu.models import Assignment, File, Url

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

# Create your models here.

class Submission(models.Model):
    assignment_obj = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    message = models.TextField(null=True, blank=True)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    files = models.ManyToManyField(File, blank=True)
    urls = models.ManyToManyField(Url, blank=True)

    @property
    def encoded_id(self):
        return urlsafe_base64_encode(force_bytes(self.id))

    @property
    def is_corrected(self):
        if len(self.correction_set.all()) == 0:
            return False
        return True

    @property
    def is_submitted_on_time(self):
        print(self.date_added)
        print(self.assignment_obj.date_due)
        if self.date_added <= self.assignment_obj.date_due:
            return True
        return False

class Correction(models.Model):
    submission_obj = models.ForeignKey(Submission, on_delete=models.CASCADE)
    message = models.TextField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    given_marks = models.DecimalField(max_digits=6, decimal_places=2)