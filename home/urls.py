from unicodedata import name
from django.urls import path
from .views import (
    HomePageView,
    ProfilePageView
)

app_name = 'home'

urlpatterns = [
    path('', HomePageView.as_view(), name='home-page'),
    path('profile/', ProfilePageView.as_view(), name='profile-page'),
]