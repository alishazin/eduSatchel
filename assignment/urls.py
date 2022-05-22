from django.urls import path

from .views import (
    SubmitAssignmentView,
    CorrectAssignmentView,
)

from .get_or_post_views import DeleteAssignmentPostOnlyView

app_name = 'assignment'

urlpatterns = [
    path('<classID>/<assignmentID>/submit/', SubmitAssignmentView.as_view(), name='submit-assignment'),
    path('<classID>/<assignmentID>/correct/', CorrectAssignmentView.as_view(), name='correct-assignment'),
    path('<classID>/<assignmentID>/delete/', DeleteAssignmentPostOnlyView.as_view(), name='delete-assignment'),
]