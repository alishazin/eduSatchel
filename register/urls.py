from django.urls import path
from .views import choose_type_of_account, SignUpTeacherOneView, SignUpTeacherTwoView

urlpatterns = [
    path('create/', choose_type_of_account),
    path('create/teacher/', SignUpTeacherOneView.as_view(), name="create-teacher"),
    path('create/teacher/', SignUpTeacherOneView.as_view(), name="create-teacher"),
    # path('create/email-verification/', SignUpTeacherTwoView.as_view(), name="create-verification"),
    path('create/student/', choose_type_of_account, name="create-student"),
    path('login/', choose_type_of_account, name="log-in"),
]