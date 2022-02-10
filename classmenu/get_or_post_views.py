
from django.http import Http404, HttpResponse
from django.views import View
from django.shortcuts import redirect, render
from django.utils.http import urlsafe_base64_decode

from edusatchel.decorators import authentication_check, classentry_check
from home.models import Class, ClassEnrollment
from home.send_notifications import (
    after_declining_join_request,
    after_accepting_join_request,
)

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
                'date' : msgObj.formatted_date,
                'profilePath' : request.user.profile_pic_path, 
                'username' : request.user.username,
            }

            if urlObjs is not None:
                tempList = []
                for obj in urlObjs:
                    tempList.append(obj.url)
                returnSuccessArray['urls'] = tempList

            if fileObjs is not None:
                tempList = []
                for obj in fileObjs:
                    tempList.append({'path' : obj.file_location, 'name' : obj.file_name, 'format' : obj.format, 'iconAvailable' : obj.availableIcon})
                returnSuccessArray['files'] = tempList

            return HttpResponse(json.dumps(returnSuccessArray))

        return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Something is wrong. Refresh the page !'}))

class BlockJoinRequestPostOnlyView(PostOnlyViewBase):
    @classentry_check(account_type='teacher')
    def post_only(self, request, classID):
        form = request.POST
        switchBool = {
            'true' : False,
            'false' : True,
        }
        if 'state' in form.keys():
            block = form['state']

            if block in ['true', 'false']:
                classObj = Class.objects.get(id=classID)
                classObj.active = switchBool[block]
                classObj.save()
                return HttpResponse("success")
                
        return HttpResponse("Something is wrong. Refresh the page !")
        

class ChangeClassDescriptionView(PostOnlyViewBase):
    @classentry_check(account_type='teacher')
    def post_only(self, request, classID):
        form = request.POST
        
        if 'class_desc' in form.keys():
            class_desc = form['class_desc']
            if len(class_desc) > 5 and len(class_desc) <= 300:
                classObj = Class.objects.get(id=classID)
                classObj.description = class_desc
                classObj.save()
                return HttpResponse("success")

            return HttpResponse("Description should be between 5 and 300 in length")

        return HttpResponse("Something is wrong. Refresh the page !")
        
class JoinResponseView(PostOnlyViewBase):
    @classentry_check(account_type='teacher')
    def post_only(self, request, classID, enrId64):
        form = request.POST
        errorReturnValue = HttpResponse('Something is wrong. Refresh the page !')

        try:
            enrollmentID = urlsafe_base64_decode(enrId64).decode()
        except:
            return errorReturnValue
        else:

            if enrollmentID.isnumeric() and 'response' in form.keys() and form['response'] in ['accept', 'decline']:
                response = form['response']
                classObj = Class.objects.get(id=classID)
                classEnrollmentObj = ClassEnrollment.objects.filter(class_obj=classObj, enrolled=False)

                if classEnrollmentObj:
                    valid = False
                    for obj in classEnrollmentObj:
                        if int(obj.id) == int(enrollmentID):
                            valid = True
                            if response == 'accept':
                                obj.enrolled = True
                                obj.save()
                                after_accepting_join_request(obj.student, classObj)
                            else:
                                obj.delete()
                                after_declining_join_request(obj.student, classObj)
                            break

                    if valid:
                        return HttpResponse("success")

            return errorReturnValue

class ClassDataByStepView(GetOnlyViewBase):
    @classentry_check()
    def get_only(self, request, classID, stepCount):
        import time
        time.sleep(5)
        classObj = Class.objects.get(id=classID)
        allMessages = classObj.messagepublic_set.all()
        returnData = []
        for msgObj in allMessages:
            tempObj = {
                'type' : 'publicMessage',
                'content' : msgObj.content,
                'urls' : False,
                'files' : False,
                'teacher' : True if request.user.account_type == 'teacher' else False,
                'time' : msgObj.time_only,
                'date' : msgObj.formatted_date,
                'profilePath' : msgObj.user.profile_pic_path, 
                'username' : msgObj.user.username,
            }

            if msgObj.urls:
                tempObj['urls'] = []
                for urlObj in msgObj.urls.all():
                    tempObj['urls'].append(urlObj.url)

            if msgObj.files:
                tempObj['files'] = []
                for fileObj in msgObj.files.all():
                    tempObj['files'].append({'path' : fileObj.file_location, 'name' : fileObj.file_name, 'format' : fileObj.format, 'iconAvailable' : fileObj.availableIcon})

            returnData.append(tempObj)
        return HttpResponse(json.dumps(returnData))