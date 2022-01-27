from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check
from home.views import AccountTypeView

# Create your views here.

class ClassMenuView(AccountTypeView):
    @classentry_check(account_type='teacher')
    def teacher_get(self, request, classID):
        print('teacher')
        return render(request, 'classmenu/base.html', {})

    @classentry_check(account_type='student')
    def student_get(self, request, classID):
        print('student')
        return render(request, 'classmenu/base.html', {})