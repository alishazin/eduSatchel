from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from edusatchel.decorators import authentication_check

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
        print(request.POST)
        return HttpResponse('Recieved')

class JoinNewClassView(View):
    @authentication_check(account_type='student')
    def get(self, request):
        return HttpResponse('Join New')