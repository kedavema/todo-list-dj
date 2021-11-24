# Django
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views.generic import View, DeleteView
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy, reverse
# Forms
from .forms import TaskForm
# Models
from .models import Task

    
class TaskList(LoginRequiredMixin, View):
    """ View for create tasks and list tasks """
    login_url = 'users_app:user-login'
    
    def get(self, request):
        form = TaskForm()
        tasks = Task.objects.filter(
            user=request.user
        )
        return render(request, 'todo/index.html', context={'form': form, 'tasks': tasks})
    
    def post(self, request):
        form = TaskForm(request.POST)
        if form.is_valid():
            form.instance.user = self.request.user
            new_task = form.save()
            # import pdb;pdb.set_trace()
            return JsonResponse({
                'task': model_to_dict(new_task),
                'tasktime': new_task.time.strftime("%H:%M %p").lower()},
                status=200)
        else:
            return redirect('todo_app:task_list_url')
    

def task_delete(request, id):
    task = Task.objects.get(id=id)
    # context = {'task': task}
    if request.method == 'POST':
        task.delete()
        return JsonResponse({'result': 'ok'}, status=200)
    # return render(request, 'todo/delete_task.html', context)