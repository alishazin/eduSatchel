from django.urls import path
from .views import choose_type_of_account, SignUpTeacherOneView

urlpatterns = [
    path('create/', choose_type_of_account),
    path('create/teacher/one', SignUpTeacherOneView.as_view(), name="create-teacher"),
    path('create/student/one', choose_type_of_account, name="create-student"),
    path('login/', choose_type_of_account, name="log-in"),
]