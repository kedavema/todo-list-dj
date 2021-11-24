# Django
from django.views.generic import View
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib import messages
# Forms
from .forms import LoginForm, RegistroForm
# Models
from .models import User


def user_login(request):
    """View for user login"""
    if request.method == 'POST':
        form = LoginForm(request.POST)
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(email=email, password=password)
    
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(reverse('todo_app:task_list_url'))
        else:
            messages.error(request, 'No registramos una cuenta con esos datos')
            return HttpResponseRedirect(reverse('users_app:user-login'))
    
    else:
        form = LoginForm()
    return render(request, 'users/login.html', {'form': form})
    

class LogoutView(View):
    """ View for user logout"""
    def get(self, request, *args, **kargs):
        logout(request)
        return HttpResponseRedirect(
            reverse(
                'users_app:user-login'
            )
        )
        
        
def create_new_user(request):
    """View for create a new user"""
    form = RegistroForm()
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('users_app:user-login'))
    
    return render(request, 'users/sign_up.html', {'form':form})


def check_email_exists(request):
    """Check if the email exists in the database"""
    email = request.GET.get('email', None)
    data = {
        'is_taken': User.objects.filter(email=email).exists()
    }
    if data['is_taken']:
        data['error_message'] = 'Este email ya está en uso, favor verificar'
    return JsonResponse(data)
