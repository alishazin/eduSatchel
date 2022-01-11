from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from .backends import validate_user_one, send_email_for_verification
from .models import CustomUser
from .utils import generate_token

# Create your views here.

def choose_type_of_account(request):
    return render(request, 'register/create.html', {})

class SignUpTeacherInitialView(View):
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
            user_obj = CustomUser.objects.create(
                email = request.POST['email'].strip(),
                username = request.POST['username'].strip(),
                password = request.POST['password1'].strip(),
                account_type = 'student',
            )
            send_email_for_verification(user_obj, request)
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

class SignUpTeacherFinalView(View):
    def get(self, request, uidb64, token):
        try: 
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except:
            user = None

        if user and generate_token.check_token(user, token):
            user.is_email_verified = True
            user.save()
            return HttpResponse('Verified')
        else:
            return HttpResponse('Not Verified!')
