from django.http import HttpResponse
from django.urls import path
from .views import (
    HomePageView,
    ProfilePageView,
    CreateNewClassView,
    JoinNewClassView,
    NotificationsPageView,
    SettingsPageView,
    ToDoPageView,
)
from .get_or_post_views import (
    NotificationGetOnlyView,
    ProfileChangePostOnlyView,
    ProfileRemovePostOnlyView,
    BioUpdatePostOnlyView,
)

app_name = 'home'

urlpatterns = [
    path('', HomePageView.as_view(), name='home-page'),
    path('create-new/', CreateNewClassView.as_view(), name='create-class'),
    path('join-new/', JoinNewClassView.as_view(), name='join-class'),
    path('todo/', ToDoPageView.as_view(), name='todo-page'),
    path('profile/', ProfilePageView.as_view(), name='profile-page'),
    path('notifications/', NotificationsPageView.as_view(), name='notifications-page'),
    path('settings/', SettingsPageView.as_view(), name='settings-page'),
    path('notifications/get-data/<int:stepCount>/', NotificationGetOnlyView.as_view(), name='notifications-get-only'),
    path('profile/change-profile/', ProfileChangePostOnlyView.as_view(), name='profile-change-post-only'),
    path('profile/remove-profile/', ProfileRemovePostOnlyView.as_view(), name='profile-remove-post-only'),
    path('profile/update-bio/', BioUpdatePostOnlyView.as_view(), name='bio-update-post-only'),
]