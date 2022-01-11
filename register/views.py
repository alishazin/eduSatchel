from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.views import View
from django.urls import reverse
from .backends import validate_user_one
from .models import CustomUser

# Create your views here.

def choose_type_of_account(request):
    return render(request, 'register/create.html', {})

class SignUpTeacherOneView(View):
    def get(self, request):
        return render(request, 'register/create_teacher.html', {
            'general_error' : '',
            'email_error' : '',
            'latest_email' : '',
            'username_error' : '',
            'latest_username' : '',
            'password_error' : '',
        })

    def post(self, request):
        returnStatus = validate_user_one(request.POST)
        if returnStatus == True:
            CustomUser.objects.create(
                email = request.POST['email'].strip(),
                username = request.POST['username'].strip(),
                password = request.POST['password1'].strip(),
                account_type = 'student',
            )
            return render(request, 'register/create_email_verification.html', {
                'email' : request.POST['email'],
            })
        else:
            return render(request, 'register/create_teacher.html', {
                'general_error' : returnStatus['general'],
                'email_error' : returnStatus['email'],
                'latest_email' : returnStatus['latest_email'],
                'username_error' : returnStatus['username'],
                'latest_username' : returnStatus['latest_username'],
                'password_error' : returnStatus['password'],
            })

class SignUpTeacherTwoView(View):
    def get(self, request):
        return render(request, 'register/create_email_verification.html', {})