
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse

def authentication_check(function):
    def wrapper(*args, **kwargs):
        request = args[1]
        # if request.user.is_email_verified == False, then you cannot even authenticate, 
        if request.user.is_authenticated:
            return function(*args, **kwargs)
        else:
            messages.error(request, "You have not logged in yet!")
            return redirect(reverse('log-in'))

    return wrapper
