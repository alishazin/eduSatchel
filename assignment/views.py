from assignment.models import Submission
from classmenu.models import Assignment
from home.models import Class
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from django.contrib import messages
from django.utils.http import urlsafe_base64_decode
from edusatchel.decorators import (
    classentry_check, 
    assignmententry_check,
    submissionentry_check
)

from home.send_notifications import (
    after_submitting_assignment,
)

from classmenu.backends import validate_urls_files, insert_url_and_file_values

import json

# Create your views here.

class SubmitAssignmentView(View):
    @classentry_check(account_type='student')
    @assignmententry_check
    def get(self, request, classID, assignmentID):
        assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
        try:
            submissionObj = assignmentObj.submission_set.get(student=request.user)
        except:
            submissionObj = None

        try:
            correctionObj = submissionObj.correction_set.all()[0]
        except:
            correctionObj = None

        return render(request, 'assignment/submit.html', {
            'classObj' : Class.objects.get(id=classID),
            'assignmentID' : assignmentID,
            'assignmentObj' : assignmentObj,
            'submissionObj' : submissionObj,
            'correctionObj' : correctionObj
        })

    @classentry_check(account_type='student')
    @assignmententry_check
    def post(self, request, classID, assignmentID):
        formPost = request.POST
        formData = request.FILES
        valid = False

        if 'message' in formPost.keys():
            message = formPost['message']
            if message: 
                if len(message) > 5:
                    valid = True
                else:
                    return HttpResponse(json.dumps({'success' : False, 'element' : 'message', 'error_message' : 'Message length should be greater than 5 characters'}))

        if 'file-1' in formData or 'url-1' in formPost:
            valid = True

        if valid:
            validatedUrls = validate_urls_files(formPost, formData)   
            if validatedUrls != True:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'attach', 'error_message' : validatedUrls}))

            assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
            if len(assignmentObj.submission_set.filter(student=request.user)) > 0:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'message', 'error_message' : 'Already Submitted'}))
                
            urlObjs, fileObjs = insert_url_and_file_values(formPost, formData, assignmentObj.class_obj, 'response')     
            if message:       
                submissionObj = assignmentObj.submission_set.create(message=message, student=request.user)
            else:
                submissionObj = assignmentObj.submission_set.create(student=request.user)
            submissionObj.files.set(fileObjs)
            submissionObj.urls.set(urlObjs)

            after_submitting_assignment(assignmentObj.class_obj, request.user)
            messages.error(request, 'Assignment submitted sucessfully')

            return HttpResponse(json.dumps({'success' : True}))

        return HttpResponse(json.dumps({'success' : False, 'element' : 'message', 'error_message' : 'No content to submit'}))

class CorrectAssignmentView(View):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    def get(self, request, classID, assignmentID):
        return render(request, 'assignment/correct.html', {
            'classObj' : Class.objects.get(id=classID),
            'assignmentID' : assignmentID,
            'assignmentObj' : Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode()),
        })

class CorrectSpecificAssignmentView(View):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    @submissionentry_check
    def get(self, request, classID, assignmentID, submissionID):
        submissionObj = Submission.objects.get(id=urlsafe_base64_decode(submissionID).decode())
        try:
            correctionObj = submissionObj.correction_set.all()[0]
            isSubmissionCorrected = True
        except:
            correctionObj = None
            isSubmissionCorrected = False
            
        return render(request, 'assignment/correct-specific.html', {
            'classObj' : Class.objects.get(id=classID),
            'submissionID' : submissionID,
            'submissionObj' : submissionObj,
            'correctionObj' : correctionObj,
            'isSubmissionCorrected' : isSubmissionCorrected
        })