from django.shortcuts import render
from django.views import View
from edusatchel.decorators import authentication_check

# Create your views here.

class HomePageView(View):
    @authentication_check
    def get(self, request):
        return render(request, 'home/home.html', {})

class ProfilePageView(View):
    @authentication_check
    def get(self, request):
        return render(request, 'home/profile.html', {})