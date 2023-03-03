
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

class ProfileChangePostOnlyView(PostOnlyViewBase):
    def post_only(self, request):
        files = request.FILES
        if 'testprofile' in files.keys() and check_if_valid_profile(files['testprofile']):
            fileObj = files['testprofile']
            fileFormat = get_file_format_from_content_type(fileObj.content_type)
            if request.user.profile_pic == 'profile/default.jpg':
                request.user.profile_pic = fileObj
                request.user.save()
            else:
                pathToFile = os.path.join(settings.MEDIA_URL, str(request.user.profile_pic))
                newPath = os.path.join(settings.MEDIA_URL, f'profile/{request.user.image_storage_id}/image.{fileFormat}')
                os.remove(pathToFile)
                with open(newPath, 'wb+') as destination:
                    for chunk in fileObj.chunks():
                        destination.write(chunk)
                request.user.profile_pic = f'profile/{request.user.image_storage_id}/image.{fileFormat}'
                request.user.save()

            return HttpResponse("success")
        return HttpResponse("invalid")

class ProfileRemovePostOnlyView(PostOnlyViewBase):
    def post_only(self, request):
        if request.user.profile_pic == 'profile/default.jpg':
            return HttpResponse('invalid')
        else:
            pathToFile = os.path.join(settings.MEDIA_URL, str(request.user.profile_pic))
            # os.remove(pathToFile) # used during development
            request.user.profile_pic = 'profile/default.jpg'
            request.user.save()
            return HttpResponse("success")

class BioUpdatePostOnlyView(PostOnlyViewBase):
    @authentication_check(account_type='teacher')
    def post_only(self, request):
        data = request.POST
        if 'bio' in data.keys():
            bio = data['bio'].strip()
            if len(bio) > 300 or len(bio) == 0:
                return HttpResponse("invalid")
            
            request.user.bio = bio
            request.user.save()
            return HttpResponse("success")

        return HttpResponse("wrong")
                