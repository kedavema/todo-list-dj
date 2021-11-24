from django.contrib.auth import login
from django.urls import path

from .views import LogoutView, create_new_user, user_login, check_email_exists

app_name = 'users_app'

urlpatterns = [
    
    path('login/',
         user_login,
         name='user-login'),
    path(
        'logout/', 
        LogoutView.as_view(),
        name='user-logout'),
    path(
        'sign-up/', 
        create_new_user,
        name='new-user'),
    path(
        'check_email_exists', 
        check_email_exists,
        name='check_email_exists'),
]