from django.db import models
from home.models import Class
from register.models import CustomUser

from home.backends import get_IST_from_UTC, add_zero_to_left
from home.backends import check_if_today_or_yesterday

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

    @property
    def formatted_date(self):
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
    def formatted_date_added(self):
        return check_if_today_or_yesterday(self.date_added)

    @property
    def formatted_date_due(self):
        # We will change it to showing due by time, tomorrow etc..
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
    def type(self):
        return 'assignment'

class Poll(models.Model):
    title = models.TextField(blank=False, null=False)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return 'poll'

class PollOption(models.Model):
    poll_obj = models.ForeignKey(Poll, on_delete=models.CASCADE)
    content = models.CharField(max_length=300, blank=False, null=False)

class PolledDetail(models.Model):
    poll_option_obj = models.ForeignKey(PollOption, on_delete=models.CASCADE)
    student =  models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)