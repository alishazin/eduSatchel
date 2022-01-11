from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from .models import CustomUser

import re
import time

from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMessage
from django.conf import settings
from .utils import generate_token

class CaseInsensitiveModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            case_insensitive_username_field = '{}__iexact'.format(UserModel.USERNAME_FIELD)
            user = UserModel._default_manager.get(**{case_insensitive_username_field: username})
        except UserModel.DoesNotExist:
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

def check_if_valid_email_format(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(regex, email)):
        return True
    else:
        return False

def check_if_valid_username_format(username):
    check = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    for i in username:
        if i not in check:
            return False
    return True

def validate_user_one(data):
    returnDict = {
        'general' : '',
        'email' : '',
        'latest_email' : '',
        'username' : '',
        'latest_username' : '',
        'password' : '',
    }
    if 'email' in data.keys() and 'username' in data.keys() and 'password1' in data.keys() and 'password2' in data.keys():
        returnDict['latest_email'] = data['email']
        returnDict['latest_username'] = data['username']
        # Email check
        if not check_if_valid_email_format(data['email'].strip()):
            returnDict['email'] = 'Invalid email address.'
            return returnDict

        if CustomUser.objects.filter(email=data['email'].strip()):
            returnDict['email'] = 'An account with this gmail exist.'
            return returnDict

        # username check
        if len(data['username'].strip()) < 3 and len(data['username'].strip()) > 30:
            returnDict['username'] = 'Username should be between 3 and 30 characters in length.'
            return returnDict

        if not check_if_valid_username_format(data['username'].strip()):
            returnDict['username'] = 'Username should only contain (a-z) and (0-9)'
            return returnDict

        # password check
        if len(data['password1'].strip()) < 8:
            returnDict['password'] = 'Password should contain atleast 8 characters'
            return returnDict

        if data['password1'].strip() != data['password2'].strip():
            returnDict['password'] = 'Password confirmation failed'
            return returnDict

        return True
    else: 
        returnDict['general'] = 'Something went wrong. Refresh the page ?'
        return returnDict

def send_email_for_verification(userObj, request):
    current_site = get_current_site(request)
    email_subject = 'Activate Your Account'
    email_body = render_to_string('email_formats/account_activate.html', {
        'userObj': userObj,
        'domain': current_site,
        'uid': urlsafe_base64_encode(force_bytes(userObj.pk)),
        'token': generate_token.make_token(userObj),
    })

    emailToSend = EmailMessage(
        subject=email_subject, 
        body=email_body, 
        from_email=settings.EMAIL_HOST_USER,
        to=[userObj.email],
    )

    emailToSend.send()

def expire_account(userObj):
    # expiration time = 10 min = 600 sec
    time.sleep(600)
    newUserObj = CustomUser.objects.get(pk=userObj.pk)
    if newUserObj.is_email_verified == False:
        newUserObj.delete()