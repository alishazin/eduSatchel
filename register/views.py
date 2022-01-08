from django.shortcuts import render
from django.http import HttpResponse
from django.views import View

# Create your views here.

def choose_type_of_account(request):
    return render(request, 'register/create.html', {})

class SignUpTeacherOneView(View):
    def get(self, request):
        return render(request, 'register/create_teacher.html', {})

    def post(self, request):
        print(request.POST)
        return HttpResponse('2')