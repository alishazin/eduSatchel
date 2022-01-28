from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check
# from home.views import AccountTypeView

# Create your views here.

class ClassMenuView(View):
    @classentry_check()
    def get(self, request, classID):
        return render(request, 'classmenu/class.html', {})