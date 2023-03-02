from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from classmenu.models import Assignment
from edusatchel.decorators import authentication_check
from assignment.models import Submission


from .send_notifications import (
    after_creating_class,
    after_joining_class,
)
from .backends import (
    validate_new_class,
    validate_join_class,
    get_number_of_unseen_notification,
)

import os

class AccountTypeView(View):
    @authentication_check()
    def get(self, request, *args, **kwargs):
        if request.user.account_type == 'teacher':
            return self.teacher_get(request, *args, **kwargs)
        else:
            return self.student_get(request, *args, **kwargs)

# Create your views here.

class HomePageView(AccountTypeView): 
    def teacher_get(self, request):
        return render(request, 'home/home.html', {
            'header' : 'Classes Created',
            # 'create_new_title' : 'Create A New Class',
            # 'url_new' : f"{reverse('home:create-class')}",
            'class_obj_array' : request.user.class_set.all(),
            'notifications' : get_number_of_unseen_notification(request),
        })

    def student_get(self, request):
        return render(request, 'home/home.html', {
            'header' : 'Classes Entrolled',
            # 'create_new_title' : 'Join A New Class',
            # 'url_new' : f"{reverse('home:join-class')}",
            'classenrollment_obj_array' : request.user.classenrollment_set.filter(enrolled=True),
            'notifications' : get_number_of_unseen_notification(request),
        })

class ToDoPageView(View):
    def get(self, request):
        returnList = []
        if request.user.isTeacher:
            allSubmissions = Submission.objects.filter(assignment_obj__in=list(Assignment.objects.filter(class_obj__in=list(request.user.class_set.all())))).order_by('date_added')
            for i in allSubmissions:
                if not i.is_corrected:
                    returnList.append([i.student.username, i.assignment_obj.content, i.assignment_obj.class_obj.title, i.get_correct_url, i.assignment_obj.get_correction_url()])
        else:
            allAssignments = Assignment.objects.filter(class_obj__in=list(request.user.get_classes_enrolled())).order_by('date_due')
            for i in allAssignments:
                if not i.is_submitted(request.user):
                    returnList.append([i.class_obj.title, i.content, i.get_ist_date_due, i.get_submit_url()])

        return render(request, 'home/todo.html', {
            'notifications' : get_number_of_unseen_notification(request),
            'allData' : returnList,
        })
        
class NotificationsPageView(View):
    @authentication_check()
    def get(self, request):
        return render(request, 'home/notifications.html', {
            'notifications' : get_number_of_unseen_notification(request),
        })

class SettingsPageView(View):
    @authentication_check()
    def get(self, request):
        return render(request, 'home/settings.html', {
            'notifications' : get_number_of_unseen_notification(request),
        })