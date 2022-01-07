from django.urls import path
from .views import choose_type_of_account

urlpatterns = [
    path('create/', choose_type_of_account),
    path('create/teacher/', choose_type_of_account, name="create-teacher"),
    path('create/student/', choose_type_of_account, name="create-student"),
]