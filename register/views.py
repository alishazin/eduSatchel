from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from .backends import validate_user_one

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
            # next step
            return HttpResponse('Success')
        else:
            return render(request, 'register/create_teacher.html', {
                'general_error' : returnStatus['general'],
                'email_error' : returnStatus['email'],
                'latest_email' : returnStatus['latest_email'],
                'username_error' : returnStatus['username'],
                'latest_username' : returnStatus['latest_username'],
                'password_error' : returnStatus['password'],
            })