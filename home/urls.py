from django.http import HttpResponse
from django.urls import path
from .views import (
    HomePageView,
    ProfilePageView,
    CreateNewClassView,
    JoinNewClassView,
    NotificationsPageView,
    SettingsPageView,
)
from .get_or_post_views import (
    NotificationGetOnlyView,
    ProfileTestPostOnlyView,
)

app_name = 'home'

urlpatterns = [
    path('', HomePageView.as_view(), name='home-page'),
    path('create-new/', CreateNewClassView.as_view(), name='create-class'),
    path('join-new/', JoinNewClassView.as_view(), name='join-class'),
    path('profile/', ProfilePageView.as_view(), name='profile-page'),
    path('notifications/', NotificationsPageView.as_view(), name='notifications-page'),
    path('settings/', SettingsPageView.as_view(), name='settings-page'),
    path('notifications/get-data/<int:stepCount>/', NotificationGetOnlyView.as_view(), name='notifications-get-only'),
    path('profile/test-profile/', ProfileTestPostOnlyView.as_view(), name='profile-test-post-only'),
]