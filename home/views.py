from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from edusatchel.decorators import authentication_check

from .backends import validate_new_class
from .models import Class

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
            'create_new_title' : 'Create A New Class',
            'url_new' : f"{reverse('home:create-class')}",
        })

    def student_get(self, request):
        return render(request, 'home/home.html', {
            'header' : 'Classes Entrolled',
            'create_new_title' : 'Join A New Class',
            'url_new' : f"{reverse('home:join-class')}",
        })


class ProfilePageView(View):
    def get(self, request):
        return render(request, 'home/profile.html', {})
        
class NotificationsPageView(View):
    def get(self, request):
        return render(request, 'home/notifications.html', {})

class CreateNewClassView(View):
    @authentication_check(account_type='teacher')
    def get(self, request):
        return render(request, 'home/create_new.html', {})

    @authentication_check(account_type='teacher')
    def post(self, request):
        returnStatus = validate_new_class(request)

        if returnStatus == True:    
            title = request.POST['title'].strip()
            description = request.POST['description'].strip()
            active = False if 'active' in request.POST.keys() else True
            print(active)
            
            request.user.class_set.create(
                title=title,
                description=description,
                active=active,
            )
            return HttpResponse("Successfully created class")

        else:
            return render(request, 'home/create_new.html', {
                'title_error' : returnStatus['title_error'],
                'description_error' : returnStatus['description_error'],
                'general_error' : returnStatus['general_error'],
            })

class JoinNewClassView(View):
    @authentication_check(account_type='student')
    def get(self, request):
        return HttpResponse('Join New')