from django.db import models
from applications.users.models import User


class Task(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField('Titulo', max_length=255)
    time = models.TimeField()
    
    def __str__(self):
        return f'{str(self.id) + " - " + self.title}'
    
    
    