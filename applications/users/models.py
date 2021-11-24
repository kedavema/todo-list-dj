# Django
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# Manager
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(unique=True)
    name = models.CharField('Nombre', max_length=100, blank=True)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()
