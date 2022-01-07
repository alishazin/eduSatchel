from django.urls import path
from .views import choose_type_of_account

urlpatterns = [
    path('create/', choose_type_of_account),
]