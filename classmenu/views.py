from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check
from home.models import Class
# from home.views import AccountTypeView

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
        return render(request, 'classmenu/add_assignment.html', {})