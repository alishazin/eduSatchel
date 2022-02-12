from django.urls import path

from .views import (
    ClassMenuView,
    ClassSettingsView,
    AddAssignmentView,
    AddPollView,
    AssignmentsView,
)

from .get_or_post_views import (
    SendPublicMessagePostOnlyView,
    BlockJoinRequestPostOnlyView,
    ChangeClassDescriptionView,
    JoinResponseView,
    ClassDataByStepView,
    PollCastedView,
)

app_name = 'classmenu'

urlpatterns = [
    path('<classID>/', ClassMenuView.as_view(), name="class"),
    path('<classID>/send-message/', SendPublicMessagePostOnlyView.as_view()),
    path('<classID>/block-join-request/', BlockJoinRequestPostOnlyView.as_view()),
    path('<classID>/change-class-desc/', ChangeClassDescriptionView.as_view()),
    path('<classID>/join-response/<enrId64>/', JoinResponseView.as_view()),
    path('<classID>/settings/', ClassSettingsView.as_view(), name="settings"),
    path('<classID>/assignments/', AssignmentsView.as_view(), name="assignments"),
    path('<classID>/assignments/add-assignment/', AddAssignmentView.as_view(), name="add-assignment"),
    path('<classID>/polls/add-poll/', AddPollView.as_view(), name="add-poll"),
    path('<classID>/get-class-data/<int:stepCount>/', ClassDataByStepView.as_view()),
    path('<classID>/poll-casted/', PollCastedView.as_view()),
]