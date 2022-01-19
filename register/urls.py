from re import template
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
    ChangePasswordView
)

urlpatterns = [
    path('create/', choose_type_of_account, name='create-account'),
    path('create/teacher/', SignUpTeacherInitialView.as_view(), name="create-teacher"),
    path('create/student/', SignUpStudentInitialView.as_view(), name="create-student"),
    path('teacher/activate-user/<uidb64>/<token>/', SignUpTeacherFinalView.as_view(), name='activate-teacher'),
    path('student/activate-user/<uidb64>/<token>/', SignUpStudentFinalView.as_view(), name='activate-student'),
    path('login/', LogInView.as_view(), name="log-in"),
    path('forgot-password/', ForgotPasswordView.as_view(), name="forgot-password"),
    path('reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(template_name='register/reset_password.html'), name="reset-password"),
    path('change-password/', ChangePasswordView.as_view(), name="change-password"),
]