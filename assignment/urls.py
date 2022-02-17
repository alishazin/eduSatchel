from django.urls import path

from .views import (
    SubmitAssignmentView,
    CorrectAssignmentView,
)

app_name = 'assignment'

urlpatterns = [
    path('<classID>/<assignmentID>/submit/', SubmitAssignmentView.as_view(), name='submit-assignment'),
    path('<classID>/<assignmentID>/correct/', CorrectAssignmentView.as_view(), name='correct-assignment'),
]