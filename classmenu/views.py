from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check
from home.models import Class

from .backends import (
    validate_urls_files,
    insert_url_and_file_values,
    convert_IST_to_UTC
)

import json
import datetime
import math

# Create your views here.

class ClassMenuView(View):
    @classentry_check()
    def get(self, request, classID):
        classObj = Class.objects.get(id=classID)
        return render(request, 'classmenu/class.html', {
            'classObj' : classObj,
            'msgObjects' : classObj.messagepublic_set.all(),
        })

class ClassSettingsView(View):
    @classentry_check(account_type='teacher')
    def get(self, request, classID):
        classObj = Class.objects.get(id=classID)
        return render(request, 'classmenu/settings.html', {
            'classObj' : classObj,
        })

class AddAssignmentView(View):
    @classentry_check(account_type='teacher')
    def get(self, request, classID):
        classObj = Class.objects.get(id=classID)
        return render(request, 'classmenu/add_assignment.html', {
            'classObj' : classObj,
        })

    @classentry_check(account_type='teacher')
    def post(self, request, classID):
        formPost = request.POST
        formData = request.FILES

        if 'content' in formPost.keys() and 'due-date' in formPost.keys() and 'total-marks' in formPost.keys():
            content = formPost['content'].strip()

            if len(content) <= 5:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'content', 'error_message' : 'Content length should be greater than 5 characters'}))

            dueDate = request.POST['due-date']
            try:
                dueDateTimeObj = datetime.datetime.strptime(dueDate, '%Y-%m-%d %H:%M')
            except:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'dueDate', 'error_message' : 'Due date is a required field'}))
            else:
                if dueDateTimeObj <= datetime.datetime.now():
                    return HttpResponse(json.dumps({'success' : False, 'element' : 'dueDate', 'error_message' : 'Due date and time should be greater than the current datetime'}))

            totalMarks = request.POST['total-marks']
            try:
                totalMarksFloat = float(totalMarks)
                if math.isnan(totalMarksFloat):
                    raise BaseException() 
            except:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'totalMarks', 'error_message' : 'Total mark should be a number'}))
            else:
                if totalMarksFloat <= 0:
                    return HttpResponse(json.dumps({'success' : False, 'element' : 'totalMarks', 'error_message' : 'Total mark should be a positive value.'}))
                elif totalMarksFloat > 1000:
                    return HttpResponse(json.dumps({'success' : False, 'element' : 'totalMarks', 'error_message' : 'Total mark should be lesser than 1000.'}))
                totalMarksFloat = round(totalMarksFloat, 2)
                print(totalMarksFloat)


            validatedUrls = validate_urls_files(formPost, formData)   
            if validatedUrls != True:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'attach', 'error_message' : validatedUrls}))

            classObj = Class.objects.get(id=classID)
            urlObjs, fileObjs = insert_url_and_file_values(formPost, formData, classObj, 'assignment')           
            assigObj = classObj.assignment_set.create(
                content = content,
                date_due=convert_IST_to_UTC(dueDateTimeObj),
                total_marks=totalMarksFloat,
            )
            assigObj.files.set(fileObjs)
            assigObj.urls.set(urlObjs)

            return HttpResponse(json.dumps({'success' : True}))

        return HttpResponse(json.dumps({'success' : False, 'element' : 'alert', 'error_message' : 'Something is wrong. Refresh the page !'}))