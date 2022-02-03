from django.urls import path

from .views import (
    ClassMenuView,
    ClassSettingsView,
)

from .get_or_post_views import (
    SendPublicMessagePostOnlyView,
    BlockJoinRequestPostOnlyView,
)

app_name = 'classmenu'

urlpatterns = [
    path('<classID>/', ClassMenuView.as_view(), name="class"),
    path('<classID>/send-message/', SendPublicMessagePostOnlyView.as_view()),
    path('<classID>/block-join-request/', BlockJoinRequestPostOnlyView.as_view()),
    path('<classID>/settings/', ClassSettingsView.as_view(), name="settings"),
]