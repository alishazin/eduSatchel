from django.urls import path
from .views import choose_type_of_account, SignUpTeacherInitialView, SignUpFinalView

urlpatterns = [
    path('create/', choose_type_of_account),
    path('create/teacher/', SignUpTeacherInitialView.as_view(), name="create-teacher"),
    path('create/student/', choose_type_of_account, name="create-student"),
    path('activate-user/<uidb64>/<token>/', SignUpFinalView.as_view(), name='activate-account'),
    path('login/', choose_type_of_account, name="log-in"),
]