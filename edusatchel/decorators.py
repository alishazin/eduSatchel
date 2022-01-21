
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse

def authentication_check(account_type=None):

    def authentication_decorator(function):

        def wrapper(*args, **kwargs):
            request = args[1]
            # if request.user.is_email_verified == False, then you cannot even authenticate, 
            if request.user.is_authenticated:
                if account_type == None or account_type == request.user.account_type:
                    return function(*args, **kwargs)
                else:
                    print("NOT ALLOWED!")
                    return redirect(reverse('home:home-page'))
            else:
                messages.error(request, "You have not logged in yet!")
                return redirect(reverse('register:log-in'))

        return wrapper

    return authentication_decorator