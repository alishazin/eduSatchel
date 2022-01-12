from django.urls import path
from .views import choose_type_of_account, SignUpTeacherInitialView, SignUpTeacherFinalView

urlpatterns = [
    path('create/', choose_type_of_account),
    path('create/teacher/', SignUpTeacherInitialView.as_view(), name="create-teacher"),
    # below url is just for developing purpose, remove it afterwards
    path('create/teacher/final/', SignUpTeacherFinalView.as_view(), name="create-teacher-final"),
    path('create/student/', choose_type_of_account, name="create-student"),
    path('login/', choose_type_of_account, name="log-in"),
    path('activate-user/<uidb64>/<token>/', SignUpTeacherFinalView.as_view(), name='activate-account'),
]