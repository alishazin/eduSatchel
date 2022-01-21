from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from edusatchel.decorators import authentication_check

class AccountTypeView(View):
    @authentication_check()
    def get(self, request):
        if request.user.account_type == 'teacher':
            return self.teacher_get(request)
        else:
            return self.student_get(request)

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

class CreateNewClass(View):
    @authentication_check(account_type='teacher')
    def get(self, request):
        return HttpResponse('Create New')

class JoinNewClass(View):
    @authentication_check(account_type='student')
    def get(self, request):
        return HttpResponse('Join New')