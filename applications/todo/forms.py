from django import forms
from django.forms import widgets

from .models import Task


class TaskForm(forms.ModelForm):
    """Form definition for Task."""

    class Meta:
        """Meta definition for Taskform."""

        model = Task
        fields = (
            'title',
            'time'
        )
