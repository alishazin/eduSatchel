
from django.http import Http404, HttpResponse
from django.views import View
from django.shortcuts import redirect, render

from edusatchel.decorators import authentication_check, classentry_check
from home.models import Class

from .backends import (
    validate_urls_files,
    insert_url_and_file_values,
)

import json

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

class SendPublicMessagePostOnlyView(PostOnlyViewBase):
    @classentry_check()
    def post_only(self, request, classID):
        formPost = request.POST
        formData = request.FILES

        if 'content' in formPost.keys():
            content = formPost['content'].strip()

            if len(content) == 0:
                return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Content should not be empty'}))

            if len(content) > 300:
                return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Content should be less than 300 characters'}))

            validatedUrls = validate_urls_files(formPost, formData)   
            if validatedUrls != True:
                return HttpResponse(json.dumps({'success' : False, 'error_message' : validatedUrls}))

            classObj = Class.objects.get(id=classID)
            urlObjs, fileObjs = insert_url_and_file_values(formPost, formData, classObj, 'public')           
            msgObj = request.user.messagepublic_set.create(
                content = content,
                class_obj = classObj,
            )
            msgObj.files.set(fileObjs)
            msgObj.urls.set(urlObjs)

            returnSuccessArray = {
                'success' : True,
                'content' : content,
                'urls' : False,
                'files' : False,
                'teacher' : True if request.user.account_type == 'teacher' else False,
                'time' : msgObj.time_only,
            }

            if urlObjs is not None:
                tempList = []
                for obj in urlObjs:
                    tempList.append(obj.url)
                returnSuccessArray['urls'] = tempList

            if fileObjs is not None:
                tempList = []
                for obj in fileObjs:
                    tempList.append([obj.file_location, obj.file_name, obj.format])
                returnSuccessArray['files'] = tempList
            print(returnSuccessArray)
            return HttpResponse(json.dumps(returnSuccessArray))

        return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Something is wrong. Refresh the page !'}))