from django.http import HttpResponse
from django.urls import path

from .views import ClassMenuView

app_name = 'classmenu'

urlpatterns = [
    path('', ClassMenuView.as_view()),
]