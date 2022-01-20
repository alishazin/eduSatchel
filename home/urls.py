from django.urls import path
from .views import test_base

app_name = 'home'

urlpatterns = [
    path('', test_base)
]