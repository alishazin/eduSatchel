from django.http import HttpResponse
from django.urls import path
from .views import (
    HomePageView,
    NotificationsPageView,
    SettingsPageView,
    ToDoPageView,
)
from .rest_view import CreateNewClassView, JoinNewClassView
from .get_or_post_views import (
    NotificationGetOnlyView,
)

app_name = 'home'

urlpatterns = [
    path('', HomePageView.as_view(), name='home-page'),
    path('create-new/', CreateNewClassView.as_view(), name='create-class'),
    path('join-new/', JoinNewClassView.as_view(), name='join-class'),
    path('todo/', ToDoPageView.as_view(), name='todo-page'),
    path('notifications/', NotificationsPageView.as_view(), name='notifications-page'),
    path('settings/', SettingsPageView.as_view(), name='settings-page'),
    path('notifications/get-data/<int:stepCount>/', NotificationGetOnlyView.as_view(), name='notifications-get-only')
]