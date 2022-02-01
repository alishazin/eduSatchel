from django.db import models
from home.models import Class
from register.models import CustomUser

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

    def __str__(self):
        return f'<{self.location_hint}> of <{self.class_obj}>'

class Url(models.Model):
    url = models.TextField(blank=False, null=False)

    def __str__(self):
        return f'Url <{self.url}> with ID <{self.id}>'

class MessagePublic(models.Model):
    content = models.CharField(max_length=300, blank=False, null=False)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    files = models.ManyToManyField(File, blank=True)
    urls = models.ManyToManyField(Url, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    # add() to add to files
    # set() to set new querysets of files

    def __str__(self):
        return f'<{self.content}> from <{self.user}>'

    @property
    def formatted_date(self):
        from home.backends import check_if_today_or_yesterday
        return check_if_today_or_yesterday(self.date)

    @property
    def IST_datetime(self):
        from home.backends import get_IST_from_UTC
        return get_IST_from_UTC(self.date)

    @property
    def time_only(self):
        from home.backends import get_IST_from_UTC
        ISTDate = get_IST_from_UTC(self.date)
        return f'{ISTDate.hour}:{ISTDate.minute}'