from register.models import CustomUser
from django.db import models
from classmenu.models import Assignment, File, Url

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from home.backends import get_date_min_remaining_dates, get_IST_from_UTC

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

    @property
    def get_ist_date_added(self):
        return get_IST_from_UTC(self.date_added)

    @property
    def date_due_countdown(self):
        return get_date_min_remaining_dates(self.date_added, convertToIST = True, reverse = False, dateToCompare = self.assignment_obj.date_due)
    
    @property
    def date_due_countdown_missing(self):
        return get_date_min_remaining_dates(self.date_added, convertToIST = True, reverse = True, dateToCompare = self.assignment_obj.date_due)

class Correction(models.Model):
    submission_obj = models.ForeignKey(Submission, on_delete=models.CASCADE)
    message = models.TextField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    given_marks = models.DecimalField(max_digits=6, decimal_places=2)

    @property
    def formatted_given_marks(self):
        if float(self.given_marks) == int(self.given_marks):
            return int(self.given_marks)
        return self.given_marks

    @property
    def encoded_id(self):
        return urlsafe_base64_encode(force_bytes(self.id))

    @property
    def get_ist_date_added(self):
        return get_IST_from_UTC(self.date_added)