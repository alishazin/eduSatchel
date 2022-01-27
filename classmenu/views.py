from django.shortcuts import render
from django.views import View
from edusatchel.decorators import authentication_check

# Create your views here.

class ClassMenuView(View):
    @authentication_check()
    def get(self, request):
        return render(request, 'classmenu/base.html', {})