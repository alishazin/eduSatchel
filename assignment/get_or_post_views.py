
from assignment.models import Correction, Submission
from classmenu.models import Assignment
from django.http import Http404, HttpResponse
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
from .templatetags.assignment_extras import (
    is_assignment_submitted_filter
)
from .backends import convert_date_to_array_for_more_details_data

import json
import math
from home.models import Class

from home.send_notifications import (
    after_correcting_submission,
)

from edusatchel.decorators import (
    authentication_check,
    classentry_check, 
    assignmententry_check,
    submissionentry_check
)

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

class DeleteSubmissionPostOnlyView(PostOnlyViewBase):
    @classentry_check(account_type='student')
    @assignmententry_check
    def post_only(self, request, classID, assignmentID):
        assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
        submissionObject = assignmentObj.submission_set.filter(student=request.user)

        if submissionObject:
            try:
                correctionObj = submissionObject.correction_set.all()[0]
            except:
                pass
            else:
                correctionObj.delete()

            submissionObject.delete()
            messages.error(request, 'Assignment submission deleted successfully')
            return HttpResponse(json.dumps({'success' : True}))

        return HttpResponse(json.dumps({'success' : False, 'element' : 'message', 'error_message' : 'Not submitted yet!'}))

class AllSubmissionsGetOnlyView(GetOnlyViewBase):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    def get_only(self, request, classID, assignmentID):
        assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
        responseDict = {
            'corrected' : [],
            'not-corrected' : [],
        }
        for submissionObj in assignmentObj.submission_set.all():
            if submissionObj.is_corrected:
                responseDict['corrected'].append([submissionObj.student.username.capitalize(), submissionObj.is_submitted_on_time, submissionObj.encoded_id])
            else:
                responseDict['not-corrected'].append([submissionObj.student.username.capitalize(), submissionObj.is_submitted_on_time, submissionObj.encoded_id])

        return HttpResponse(json.dumps(responseDict))
    
class AddCorrectionPostOnlyView(PostOnlyViewBase):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    @submissionentry_check
    def post_only(self, request, classID, assignmentID, submissionID):
        assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
        submissionObj = Submission.objects.get(id=urlsafe_base64_decode(submissionID).decode())

        formData =  request.POST

        if 'message' in formData.keys() and 'marks' in formData.keys():
            if len(submissionObj.correction_set.all()) == 0:
                marks = formData['marks']
                try:
                    marksFloat = float(marks)
                    if math.isnan(marksFloat):
                        raise BaseException() 
                except:
                    return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Rewarding mark should be a number'}))
                else:
                    if marksFloat < 0:
                        return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Rewarding mark should be a positive value.'}))
                    elif marksFloat > assignmentObj.total_marks:
                        return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Rewarding mark should be less than total marks.'}))
                    marksFloat = round(marksFloat, 2)

                correctionObj = submissionObj.correction_set.create(message = str(formData['message']).strip(), given_marks = marksFloat)
                after_correcting_submission(assignmentObj.class_obj, assignmentObj, correctionObj)
                messages.error(request, 'Submission reviewed sucessfully')
                return HttpResponse(json.dumps({'success' : True}))
        
            else:
                return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Already corrected.'}))
        else:
            return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Not enough formdata!'}))

class DeleteCorrectionPostOnlyView(PostOnlyViewBase):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    @submissionentry_check
    def post_only(self, request, classID, assignmentID, submissionID, correctionID):
        submissionObj = Submission.objects.get(id=urlsafe_base64_decode(submissionID).decode())
        correctionObj = Correction.objects.get(id=urlsafe_base64_decode(correctionID).decode())
        if len(submissionObj.correction_set.all()) != 0:
            correctionObj.delete()
            return HttpResponse(json.dumps({'success' : True}))
        else:
            return HttpResponse(json.dumps({'success' : False, 'error_message' : 'Nothing to delete'}))

class GetMoreDataGetOnlyView(GetOnlyViewBase):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    def get_only(self, request, classID, assignmentID):
        # import time
        # time.sleep(2)
        classObj = Class.objects.get(id=classID)
        assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
        returnList = []

        for enrollmentObj in classObj.get_enrolled_students():
            studentObj = enrollmentObj.student
            studentName = studentObj.username

            try:
                submissionObj = assignmentObj.submission_set.get(student=studentObj)
            except:
                submitted = False
                submissionDate = []
                corrected = ''
                correctionDate = []
                onTime = ''
                mark = ''
                correctionID = ''

            else:
                submitted = True
                submissionDate = convert_date_to_array_for_more_details_data(submissionObj.get_ist_date_added)
                try:
                    correctionObj = submissionObj.correction_set.all()[0]
                except:
                    corrected = False
                    correctionDate = []
                    onTime = submissionObj.is_submitted_on_time
                    mark = ''
                    correctionID = submissionObj.encoded_id
                else:
                    corrected = True
                    correctionDate = convert_date_to_array_for_more_details_data(correctionObj.get_ist_date_added)
                    onTime = submissionObj.is_submitted_on_time
                    mark = correctionObj.formatted_given_marks
                    correctionID = submissionObj.encoded_id
            
            returnList.append([studentName, submitted, submissionDate, corrected, correctionDate, onTime, mark, correctionID])
        return HttpResponse(json.dumps(returnList))