from classmenu.models import Assignment
from django.http import Http404
from django.contrib import messages
from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_decode
from django.urls import reverse
from home.models import Class

def authentication_check(account_type=None):

    def authentication_decorator(function):

        def wrapper(*args, **kwargs):
            request = args[1]
            # if request.user.is_email_verified == False, then you cannot even authenticate, 
            if request.user.is_authenticated:
                if account_type == None or account_type == request.user.account_type:
                    return function(*args, **kwargs)
                else:
                    messages.error(request, f"You should be a {account_type} to access it!")
                    return redirect(reverse('home:home-page'))
            else:
                messages.error(request, "You have not logged in yet!")
                return redirect(reverse('register:log-in'))

        return wrapper

    return authentication_decorator

def classentry_check(account_type=None):
    account_type = account_type

    def authentication_decorator(function):

        def wrapper(*args, **kwargs):
            request = args[1]
            classID = kwargs['classID']
            type_account = account_type

            try:
                classObj = Class.objects.get(id=classID)
            except:
                raise Http404
            else:
                if request.user.is_authenticated:
                    type_account = request.user.account_type if type_account == None else type_account
                    if type_account == 'teacher' and classObj.teacher == request.user:
                        return function(*args, **kwargs)
                    else:
                        classEntrolled = request.user.classenrollment_set.filter(class_obj=classObj, enrolled=True)
                        if type_account == 'student' and classEntrolled:
                            return function(*args, **kwargs)
                        else:
                            raise Http404
                else:
                    messages.error(request, "You have not logged in yet!")
                    return redirect(reverse('register:log-in'))

        return wrapper

    return authentication_decorator

def assignmententry_check(function):

    def wrapper(*args, **kwargs):
        request = args[1]
        assignmentID = kwargs['assignmentID']
        classID = kwargs['classID']
        # You should make sure than classID is correct. We dont verify it here.
        # You can call classentry_check() before it
        classObj = Class.objects.get(id=classID)
        try:
            decodedID = urlsafe_base64_decode(assignmentID).decode()
            assignmentObj = Assignment.objects.get(id=decodedID)
        except:
            raise Http404
        else:
            if assignmentObj.class_obj == classObj:
                return function(*args, **kwargs)
            raise Http404

    return wrapper