from django.http import HttpResponse
from django.urls import path
from .views import (
    HomePageView,
    ProfilePageView,
    CreateNewClassView,
    JoinNewClassView,
    NotificationsPageView,
)
from .get_views import (
    NotificationGetOnlyView,
)

app_name = 'home'

urlpatterns = [
    path('', HomePageView.as_view(), name='home-page'),
    path('create-new/', CreateNewClassView.as_view(), name='create-class'),
    path('join-new/', JoinNewClassView.as_view(), name='join-class'),
    path('profile/', ProfilePageView.as_view(), name='profile-page'),
    path('notifications/', NotificationsPageView.as_view(), name='notifications-page'),
    path('notifications/get-data/<int:stepCount>/', NotificationGetOnlyView.as_view(), name='notifications-get-only'),
]