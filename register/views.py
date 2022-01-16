import email
from django.shortcuts import redirect, render
from django.http import Http404, HttpResponse
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth import logout, authenticate, login
from django.conf import settings

from .backends import (
    validate_user_one, 
    send_email_for_verification, 
    expire_account, 
    validate_final_signup, 
    get_verified_users_from_generator_if_any,
)
from .models import CustomUser
from .utils import generate_token

from threading import Thread

def choose_type_of_account(request):
    return render(request, 'register/create.html', {})

# SignUp Teacher

class SignUpTeacherInitialView(View):
    def get(self, request):
        return render(request, 'register/create_initial.html', {
            'account_for' : 'Teacher',
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
            # create_user should be user, not create() as it will not hash the password, so wont be able to authenticate
            user_obj = CustomUser.objects.create_user(
                email = request.POST['email'].strip(),
                username = request.POST['username'].strip(),
                password = request.POST['password1'].strip(),
                account_type = 'teacher',
            )
            send_email_for_verification(user_obj, request, 'teacher')
            Thread(target=lambda : expire_account(user_obj)).start()
            return render(request, 'register/create_email_verification.html', {
                'email' : request.POST['email'],
            })
        else:
            return render(request, 'register/create_initial.html', {
                'account_for' : 'Teacher',
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
            user = CustomUser.objects.get(pk=uid, account_type='teacher')
        except:
            user = None

        if user and generate_token.check_token(user, token):
            user.is_email_verified = True
            user.save()
            return render(request, 'register/create_teacher_final.html', {
                'general_error' : '',
                'profile_error' : '',
                'bio_error' : '',
            })
        else:
            raise Http404

    def post(self, request, uidb64, token):
        data = request.POST
        files = request.FILES
        try: 
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid, account_type='teacher')
        except:
            user = None

        if user:
            returnStatus = validate_final_signup('teacher', data, files)

            if returnStatus == 'bioOnly':
                user.bio = data['bio']
                user.save()
                return HttpResponse("completed bioOnly")

            elif returnStatus == 'both':
                user.profile_pic = files['profile_pic']
                user.bio = data['bio']
                user.save()
                return HttpResponse("completed both")
                
            else:
                return render(request, 'register/create_teacher_final.html', {
                    'general_error' : returnStatus['general'],
                    'profile_error' : returnStatus['profile'],
                    'bio_error' : returnStatus['bio'],
                })
        else:
            raise Http404

# SignUp Student

class SignUpStudentInitialView(View):
    def get(self, request):
        return render(request, 'register/create_initial.html', {
            'account_for' : 'Student',
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
            # create_user should be user, not create() as it will not hash the password, so wont be able to authenticate
            user_obj = CustomUser.objects.create_user(
                email = request.POST['email'].strip(),
                username = request.POST['username'].strip(),
                password = request.POST['password1'].strip(),
                account_type = 'student',
            )
            send_email_for_verification(user_obj, request, 'student')
            Thread(target=lambda : expire_account(user_obj)).start()
            return render(request, 'register/create_email_verification.html', {
                'email' : request.POST['email'],
            })
        else:
            return render(request, 'register/create_initial.html', {
                'account_for' : 'Student',
                'general_error' : returnStatus['general'],
                'email_error' : returnStatus['email'],
                'latest_email' : returnStatus['latest_email'],
                'username_error' : returnStatus['username'],
                'latest_username' : returnStatus['latest_username'],
                'password_error' : returnStatus['password'],
            })


class SignUpStudentFinalView(View):
    def get(self, request, uidb64, token):
        try: 
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid, account_type='student')
        except:
            user = None

        if user and generate_token.check_token(user, token):
            user.is_email_verified = True
            user.save()
            return render(request, 'register/create_student_final.html', {
                'profile_error' : '',
            })
        else:
            raise Http404

    def post(self, request, uidb64, token):
        data = request.POST
        files = request.FILES
        try: 
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid, account_type='student')
        except:
            user = None

        if user:
            returnStatus = validate_final_signup('student', data, files)

            if returnStatus == True:
                user.profile_pic = files['profile_pic']
                user.save()
                return HttpResponse("completed With profile")

            elif returnStatus == False:
                return HttpResponse("completed without profile")

            else:
                return render(request, 'register/create_student_final.html', {
                    'profile_error' : returnStatus['profile'],
                })
        else:
            raise Http404

# Login

class LogInView(View):
    def get(self, request):
        return render(request, 'register/log_in.html', {})

    def post(self, request):
        data = request.POST

        if 'email' in data.keys() and 'password' in data.keys():
            user = authenticate(
                email=data['email'].strip(), 
                password=data['password'].strip()
            )

            if user is not None:
                if user.is_email_verified:
                    login(request, user, backend='register.backends.CaseInsensitiveModelBackend')
                    return HttpResponse('Login completed')

                else:
                    return render(request, 'register/log_in.html', {
                        'general_error' : '',
                        'error_details' : 'Email is not verified. Check your inbox to verify',
                    })
            else:
                return render(request, 'register/log_in.html', {
                    'general_error' : '',
                    'error_details' : 'Email or password is incorrect',
                })

        else:
            return render(request, 'register/log_in.html', {
                'general_error' : 'Something went wrong. Refresh the page ?',
                'error_details' : '',
            })

# Forgot Password And Reset

from django.contrib.auth.forms import PasswordResetForm

class ForgotPasswordView(View):
    def get(self, request):
        return render(request, 'register/forgot-pass.html', {})

    def post(self, request):
        email = request.POST['email']
        userGenerator = PasswordResetForm.get_users('self', email)
        user = get_verified_users_from_generator_if_any(userGenerator)
        if user != False:
            viewObj = PasswordResetForm(request.POST)
            if viewObj.is_valid():
                # both email_template_name and html_email_template_name should be used for django to not check for url named `password_reset_confirm`
                viewObj.save(
                    request=request, 
                    email_template_name='email_formats/reset_password.html',
                    html_email_template_name='email_formats/reset_password.html',
                    subject_template_name='email_formats/reset_password_header.txt',
                )

        else:
            return render(request, 'register/forgot-pass.html', {
                'error' : f"No verified user with gmail '{email}'",
            })
        return render(request, 'register/reset-pass-send.html', {
            'to_email' : email,
        })