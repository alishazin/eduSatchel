from django.urls import path

from .views import (
    SubmitAssignmentView,
    CorrectAssignmentView,
    CorrectSpecificAssignmentView,
    CorrectMoreDetailsAssignmentView
)

from .get_or_post_views import (
    DeleteAssignmentPostOnlyView,
    AllSubmissionsGetOnlyView, 
    AddCorrectionPostOnlyView,
    DeleteCorrectionPostOnlyView,
    GetMoreDataGetOnlyView
)

app_name = 'assignment'

urlpatterns = [
    path('<classID>/<assignmentID>/submit/', SubmitAssignmentView.as_view(), name='submit-assignment'),
    path('<classID>/<assignmentID>/correct/', CorrectAssignmentView.as_view(), name='correct-assignment'),
    path('<classID>/<assignmentID>/correct/more-details/', CorrectMoreDetailsAssignmentView.as_view(), name='more-submission-details'),
    path('<classID>/<assignmentID>/correct/more-details/get-data/', GetMoreDataGetOnlyView.as_view(), name='more-details-get-data'),
    path('<classID>/<assignmentID>/correct/<submissionID>/', CorrectSpecificAssignmentView.as_view(), name='correct-specific-assignment'),
    path('<classID>/<assignmentID>/correct/<submissionID>/add-correction/', AddCorrectionPostOnlyView.as_view(), name='add-correction'),
    path('<classID>/<assignmentID>/correct/<submissionID>/<correctionID>/delete/', DeleteCorrectionPostOnlyView.as_view(), name='delete-correction'),
    path('<classID>/<assignmentID>/delete/', DeleteAssignmentPostOnlyView.as_view(), name='delete-assignment'),
    path('<classID>/<assignmentID>/all-submissions/', AllSubmissionsGetOnlyView.as_view(), name='get-all-submissions'),
]