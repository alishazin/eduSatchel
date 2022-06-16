from django.urls import path

from .views import (
    SubmitAssignmentView,
    CorrectAssignmentView,
    CorrectSpecificAssignmentView
)

from .get_or_post_views import (
    DeleteAssignmentPostOnlyView,
    AllSubmissionsGetOnlyView, 
    AddCorrectionPostOnlyView
)

app_name = 'assignment'

urlpatterns = [
    path('<classID>/<assignmentID>/submit/', SubmitAssignmentView.as_view(), name='submit-assignment'),
    path('<classID>/<assignmentID>/correct/', CorrectAssignmentView.as_view(), name='correct-assignment'),
    path('<classID>/<assignmentID>/correct/<submissionID>/', CorrectSpecificAssignmentView.as_view(), name='correct-specific-assignment'),
    path('<classID>/<assignmentID>/correct/<submissionID>/add-correction/', AddCorrectionPostOnlyView.as_view(), name='add-correction'),
    path('<classID>/<assignmentID>/delete/', DeleteAssignmentPostOnlyView.as_view(), name='delete-assignment'),
    path('<classID>/<assignmentID>/all-submissions/', AllSubmissionsGetOnlyView.as_view(), name='get-all-submissions'),
]