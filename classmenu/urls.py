from django.http import HttpResponse
from django.urls import path

from .views import ClassMenuView

app_name = 'classmenu'

urlpatterns = [
    path('<classID>/', ClassMenuView.as_view()),
]