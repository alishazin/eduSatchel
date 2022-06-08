from django.db import models
from home.models import Class
from register.models import CustomUser
from django.urls import reverse

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from home.backends import (
    get_IST_from_UTC, 
    add_zero_to_left, 
    get_date_min_remaining_dates, 
    check_if_past_date, 
    check_if_today_or_yesterday
)

import uuid

def get_file_upload_location(self, filename):
    return f"files/{self.class_obj.id}/{self.location_hint}/{uuid.uuid4()}/{filename}"

LOCATION_HINTS = (
    ('public', 'Public'),
    ('assignment', 'Assignment'),
    ('response', 'Response'),
)

# Create your models here.

class File(models.Model):
    file = models.FileField(upload_to=get_file_upload_location, max_length=500)
    format = models.CharField(max_length=100, blank=False, null=True)
    location_hint = models.CharField(max_length=10, choices=LOCATION_HINTS, blank=False, null=False)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)

    @property
    def file_name(self):
        return str(self.file).split('/')[-1]
        
    @property
    def file_location(self):
        return f"/media/{self.file}"

    @property
    def availableIcon(self):
        if self.format.lower() in ['aac', 'ai', 'bmp', 'cs', 'css', 'csv', 'doc', 'docx', 'exe', 'gif', 'heic', 'html', 'java', 'jpg', 'js', 'json', 'jsx', 'key', 'm4p', 'otf', 'pdf', 'php', 'png', 'ppt', 'pptx', 'psd', 'py', 'raw', 'rb', 'sass', 'scss', 'sh', 'svg', 'tiff', 'tsx', 'ttf', 'txt', 'wav', 'woff', 'xls', 'xlsx', 'xml', 'yml']:
            return True
        return False

class Url(models.Model):
    url = models.TextField(blank=False, null=False)

class MessagePublic(models.Model):
    content = models.CharField(max_length=300, blank=False, null=False)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    files = models.ManyToManyField(File, blank=True)
    urls = models.ManyToManyField(Url, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    # add() to add to files
    # set() to set new querysets of files

    # To prevent errors
    @property
    def formatted_date(self):
        return check_if_today_or_yesterday(self.date_added)

    @property
    def formatted_date_added(self):
        return check_if_today_or_yesterday(self.date_added)

    @property
    def IST_datetime(self):
        return get_IST_from_UTC(self.date_added)

    @property
    def time_only(self):
        ISTDate = get_IST_from_UTC(self.date_added)
        return f'{add_zero_to_left(ISTDate.hour)}:{add_zero_to_left(ISTDate.minute)}'

    @property
    def type(self):
        return 'messagePublic'

class Assignment(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    content = models.TextField(blank=False, null=False)
    date_added = models.DateTimeField(auto_now_add=True)
    date_due = models.DateTimeField(blank=True, null=True)
    total_marks = models.DecimalField(max_digits=6, decimal_places=2)
    files = models.ManyToManyField(File, blank=True)
    urls = models.ManyToManyField(Url, blank=True)

    @property
    def get_total_submission_number(self):
        return len(self.submission_set.all())

    @property
    def get_ist_date_due(self):
        return get_IST_from_UTC(self.date_due)

    @property
    def formatted_total_marks(self):
        if float(self.total_marks) == int(self.total_marks):
            return int(self.total_marks)
        return self.total_marks

    @property
    def date_due_countdown(self):
        return get_date_min_remaining_dates(self.date_due, convertToIST = True)
    
    @property
    def date_due_countdown_missing(self):
        return get_date_min_remaining_dates(self.date_due, convertToIST = True, reverse = True)

    @property
    def is_missing(self):
        return check_if_past_date(self.date_due, convertToIST = True)

    @property
    def formatted_date_added(self):
        return check_if_today_or_yesterday(self.date_added)

    @property
    def formatted_date_due(self):
        return check_if_today_or_yesterday(self.date_due)

    @property
    def date_added_time_only(self):
        ISTDate = get_IST_from_UTC(self.date_added)
        return f'{add_zero_to_left(ISTDate.hour)}:{add_zero_to_left(ISTDate.minute)}'

    @property
    def date_due_time_only(self):
        ISTDate = get_IST_from_UTC(self.date_due)
        return f'{add_zero_to_left(ISTDate.hour)}:{add_zero_to_left(ISTDate.minute)}'

    @property
    def encoded_id(self):
        return urlsafe_base64_encode(force_bytes(self.id))

    @property
    def type(self):
        return 'assignment'

    def get_submit_url(self):
        return reverse('assignment:submit-assignment', kwargs={'classID' : self.class_obj.id, 'assignmentID' : self.encoded_id})

    def get_correction_url(self):
        return reverse('assignment:correct-assignment', kwargs={'classID' : self.class_obj.id, 'assignmentID' : self.encoded_id})

class Poll(models.Model):
    title = models.TextField(blank=False, null=False)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    closed = models.BooleanField(default=False)

    @property
    def type(self):
        return 'poll'

    @property
    def formatted_date_added(self):
        return check_if_today_or_yesterday(self.date_added)

    @property
    def date_added_time_only(self):
        ISTDate = get_IST_from_UTC(self.date_added)
        return f'{add_zero_to_left(ISTDate.hour)}:{add_zero_to_left(ISTDate.minute)}'

    @property
    def encoded_id(self):
        return urlsafe_base64_encode(force_bytes(self.id))

    @property
    def total_votes(self):
        total = 0
        for pollOption in self.polloption_set.all():
            total += len(pollOption.polleddetail_set.all())
        return total

    def check_if_polled(self, userObj):
        for pollOption in self.polloption_set.all():
            for pollDetails in pollOption.polleddetail_set.all():
                if pollDetails.student == userObj:
                    return True
        return False

    def get_option_results(self, userObj):
        numericalData = {}
        selected = False
        for pollOption in self.polloption_set.all():
            numericalData[pollOption.encoded_id] = 0
            for pollDetails in pollOption.polleddetail_set.all():
                if pollDetails.student == userObj:
                    selected = pollDetails.poll_option_obj.encoded_id 
                numericalData[pollDetails.poll_option_obj.encoded_id] += 1 

        total = sum(numericalData.values())
        percentageData = {}
        for option, numeric in numericalData.items():
            try:
                percentageData[option] = round((numeric / total) * 100, 2)
            except ZeroDivisionError:
                percentageData[option] = 0

        return {'selected' : selected, 'result' : percentageData}

class PollOption(models.Model):
    poll_obj = models.ForeignKey(Poll, on_delete=models.CASCADE)
    content = models.CharField(max_length=300, blank=False, null=False)

    @property
    def encoded_id(self):
        return urlsafe_base64_encode(force_bytes(self.id))

class PolledDetail(models.Model):
    poll_option_obj = models.ForeignKey(PollOption, on_delete=models.CASCADE)
    student =  models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)