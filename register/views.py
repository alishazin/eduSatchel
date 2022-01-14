from django.shortcuts import redirect, render
from django.http import Http404, HttpResponse
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from .backends import validate_user_one, send_email_for_verification, expire_account, validate_final_signup
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
            user_obj = CustomUser.objects.create(
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
            user_obj = CustomUser.objects.create(
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