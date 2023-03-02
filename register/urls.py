from django.urls import path
from .views import (
    choose_type_of_account, 
    SignUpTeacherInitialView, 
    SignUpStudentInitialView, 
    SignUpTeacherFinalView, 
    SignUpStudentFinalView,
    LogInView,
    ForgotPasswordView,
    ResetPasswordView,
    ChangePasswordView,
    LogoutView,
)

from .rest_view import CreateTeacherAccountView, CreateStudentAccountView, DeleteAccountView

app_name = 'register'

urlpatterns = [
    path('create/teacher/', CreateTeacherAccountView.as_view(), name="create-teacher"),
    path('create/student/', CreateStudentAccountView.as_view(), name="create-student"),
    path('login/', LogInView.as_view(), name="log-in"),
    path('delete-account/', DeleteAccountView.as_view(), name="delete"),
    path('logout/', LogoutView.as_view(), name="logout"),
]