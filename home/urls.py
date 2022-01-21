from django.http import HttpResponse
from django.urls import path
from .views import (
    HomePageView,
    ProfilePageView,
    CreateNewClass,
    JoinNewClass,
)

app_name = 'home'

urlpatterns = [
    path('', HomePageView.as_view(), name='home-page'),
    path('create-new/', CreateNewClass.as_view(), name='create-class'),
    path('join-new/', JoinNewClass.as_view(), name='join-class'),
    path('profile/', ProfilePageView.as_view(), name='profile-page'),
]