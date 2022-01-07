from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def choose_type_of_account(request):
    return render(request, 'register/create.html', {})