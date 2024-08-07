from django.urls import reverse
from django.shortcuts import redirect, render
from django.http import Http404, HttpResponseRedirect
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth import logout, authenticate, login
from django.contrib import messages
from django.contrib.auth.forms import PasswordResetForm
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_post_parameters
from django.contrib.auth.views import PasswordResetConfirmView
from django.core.exceptions import ImproperlyConfigured
from edusatchel.decorators import authentication_check

from .backends import (
    validate_user_one, 
    send_email_for_verification, 
    expire_account, 
    validate_final_signup, 
    get_verified_users_from_generator_if_any,
    validate_password_change,
)
from .models import CustomUser
from .utils import generate_token
from .forms import CustomSetPasswordForm

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
                user.bio = data['bio'].strip()
                user.save()
                messages.error(request, 'Account created successfully')
                return redirect(reverse('register:log-in'))

            elif returnStatus == 'both':
                user.profile_pic = files['profile_pic']
                user.bio = data['bio'].strip()
                user.save()
                messages.error(request, 'Account created successfully')
                return redirect(reverse('register:log-in'))
                
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
                messages.error(request, 'Account created successfully')
                return redirect(reverse('register:log-in'))

            elif returnStatus == False:
                messages.error(request, 'Account created successfully')
                return redirect(reverse('register:log-in'))

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
                password=data['password']
            )

            if user is not None:
                if user.is_email_verified:
                    login(request, user, backend='register.backends.CaseInsensitiveModelBackend')
                    messages.error(request, f"Login completed successfully!")
                    return redirect('home:home-page')

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

class ForgotPasswordView(View):
    def get(self, request):
        return render(request, 'register/forgot_pass.html', {})

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
            return render(request, 'register/forgot_pass.html', {
                'error' : f"No verified user with gmail '{email}'",
            })
        return render(request, 'register/reset_pass_send.html', {
            'to_email' : email,
        })

INTERNAL_RESET_SESSION_TOKEN = '_password_reset_token'

class ResetPasswordView(PasswordResetConfirmView):
    form_class = CustomSetPasswordForm
    success_url = '/register/login/'

    @method_decorator(sensitive_post_parameters())
    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        if 'uidb64' not in kwargs or 'token' not in kwargs:
            raise ImproperlyConfigured(
                "The URL path must contain 'uidb64' and 'token' parameters."
            )

        self.validlink = False
        self.user = self.get_user(kwargs['uidb64'])

        if self.user is not None:
            token = kwargs['token']
            if token == self.reset_url_token:
                session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(self.user, session_token):
                    # If the token is valid, display the password reset form.
                    self.validlink = True
                    return super().dispatch(*args, **kwargs)
            else:
                if self.token_generator.check_token(self.user, token):
                    # Store the token in the session and redirect to the
                    # password reset form at a URL without the token. That
                    # avoids the possibility of leaking the token in the
                    # HTTP Referer header.
                    self.request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                    redirect_url = self.request.path.replace(token, self.reset_url_token)
                    return HttpResponseRedirect(redirect_url)
                raise Http404
        else:
            raise Http404

    def post(self, request, *args, **kwargs):
        data = request.POST

        if 'new_password1' in data.keys() and 'new_password2' in data.keys():
            password1 = request.POST['new_password1']
            password2 = request.POST['new_password2']

            if password1 == password2:
                if len(password1) >= 8:
                    if password1.strip() != '':
                        messages.error(request, 'Password changed successfully')
                        return super().post(request, *args, **kwargs)
                    else:
                        return render(request, 'register/reset_password.html', {
                            'general_error' : '',
                            'error' : 'Blank passwords are not allowed.',
                        })     
                else:
                    return render(request, 'register/reset_password.html', {
                        'general_error' : '',
                        'error' : 'Password should contain atleast 8 characters.',
                    })     
            else:
                return render(request, 'register/reset_password.html', {
                    'general_error' : '',
                    'error' : "The two password fields didn't match.",
                })   

        else:
            return render(request, 'register/reset_password.html', {
                'general_error' : 'Something went wrong. Refresh the page ?',
                'error' : '',
            })

# Change Password

class ChangePasswordView(View):
    @authentication_check()
    def get(self, request):
        return render(request, 'register/change_password.html', {
            'old_pass_error' : '',
            'new_pass_error' : '',
            'general_error' : '',
        })

    @authentication_check()
    def post(self, request):
        returnStatus = validate_password_change(request)
        if returnStatus != True:
            return render(request, 'register/change_password.html', {
                'old_pass_error' : returnStatus['old_pass_error'],
                'new_pass_error' : returnStatus['new_pass_error'],
                'general_error' : returnStatus['general_error'],
            })

        request.user.set_password(request.POST['new_password1'])
        request.user.save()
        messages.error(request, f"Password changed successfully!")
        return redirect(reverse('register:log-in'))

# Logout

class LogoutView(View):
    @authentication_check()
    def get(self, request):
        return render(request, 'register/logout.html', {})

    @authentication_check()
    def post(self, request):
        logout(request)
        messages.error(request, 'Logged out successfully')
        return redirect(reverse('register:log-in'))