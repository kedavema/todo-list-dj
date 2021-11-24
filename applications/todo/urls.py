from django.urls import path

from .views import TaskList, task_delete

app_name = 'todo_app'

urlpatterns = [
    path('',
         TaskList.as_view(),
         name='task_list_url'),
#     path('<str:id>/delete/',
#          TaskDelete.as_view(),
#          name='task_delete_url'),
    path('<str:id>/delete/',
         task_delete,
         name='task_delete_url'),
]