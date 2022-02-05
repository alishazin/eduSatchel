from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check
from home.models import Class

from .backends import (
    validate_urls_files,
    insert_url_and_file_values,
)

import json
import datetime

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

        if 'content' in formPost.keys():
            content = formPost['content'].strip()

            if len(content) <= 5:
                return HttpResponse(json.dumps({'success' : False, 'element' : 'content', 'error_message' : 'Content length should be greater than 5'}))

            # validatedUrls = validate_urls_files(formPost, formData)   
            # if validatedUrls != True:
            #     return HttpResponse(json.dumps({'success' : False, 'error_message' : validatedUrls}))
        # print(datetime.datetime.strptime(request.POST['due-date'], '%Y-%m-%d %H:%M'))

        return HttpResponse(json.dumps({'success' : False, 'element' : 'alert', 'error_message' : 'Something is wrong. Refresh the page !'}))