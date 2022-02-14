from django.http import HttpResponse
from django.urls import path

app_name = 'assignment'

urlpatterns = [
    path('', lambda x : HttpResponse('asdas')),
]