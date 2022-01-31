from django.http import HttpResponse
from django.urls import path

from .views import (
    ClassMenuView,
)

from .get_or_post_views import (
    SendPublicMessagePostOnlyView,
)

app_name = 'classmenu'

urlpatterns = [
    path('<classID>/', ClassMenuView.as_view()),
    path('<classID>/send-message/', SendPublicMessagePostOnlyView.as_view()),
]