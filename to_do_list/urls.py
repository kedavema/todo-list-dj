from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    re_path('', include('applications.users.urls')),
    path('tasks/', include('applications.todo.urls')),
]
