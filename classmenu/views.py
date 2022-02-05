from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check
from home.models import Class

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
        print(request.FILES)
        print(request.POST)
        print(request.POST['due-date'])
        print(datetime.datetime.strptime(request.POST['due-date'], '%Y-%m-%d %H:%M'))
        print(type(datetime.datetime.strptime(request.POST['due-date'], '%Y-%m-%d %H:%M')))
        return HttpResponse(json.dumps(["asdasdasdasdsa"]))