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