
from django.http import Http404, HttpResponse
from django.views import View
from django.shortcuts import redirect, render
from django.conf import settings

from edusatchel.decorators import authentication_check
from .backends import (
    get_number_of_unseen_notification,
    get_notification_data_and_read_unseen,
    get_file_format_from_content_type,
)
from register.backends import (
    check_if_valid_profile,
)

import json
import os

class GetOnlyViewBase(View):
    @authentication_check()
    def get(self, request, *args, **kwargs):
        return self.get_only(request, *args, **kwargs)

    @authentication_check()
    def post(self, request, *args, **kwargs):
        raise Http404

class PostOnlyViewBase(View):
    @authentication_check()
    def get(self, request, *args, **kwargs):
        raise Http404

    @authentication_check()
    def post(self, request, *args, **kwargs):
        return self.post_only(request, *args, **kwargs)

class NotificationGetOnlyView(GetOnlyViewBase):
    def get_only(self, request, stepCount):
        if stepCount == 0:
            return HttpResponse("Invalid stepCount")
        returnData = get_notification_data_and_read_unseen(request, stepCount=stepCount)
        dataList = returnData[0]
        return HttpResponse(json.dumps([dataList, returnData[1], get_number_of_unseen_notification(request)]))