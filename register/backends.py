from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from validate_email import validate_email

import re

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

def validate_user_one(data):
    returnDict = {
        'general' : '',
        'email' : '',
        'username' : '',
        'password' : '',
    }
    if 'email' in data.keys() and 'username' in data.keys() and 'password1' in data.keys() and 'password2' in data.keys():
        # Email check
        if not check_if_valid_email_format(data['email'].strip()):
            returnDict['email'] = 'Invalid email address!'
            return returnDict
    else: 
        returnDict['general'] = 'Something went wrong. Try refreshing the page!'
        return returnDict