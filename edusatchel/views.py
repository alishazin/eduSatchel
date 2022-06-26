from django.views import View
from django.shortcuts import redirect
from django.urls import reverse

class DefaultView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect(reverse('home:home-page'))
        return redirect(reverse('register:log-in'))
        
