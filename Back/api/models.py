from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractUser):
    objects = UserManager()

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class TaskStatus(models.Model):
    name = models.CharField(max_length=50) 

    def __str__(self):
        return self.name

class TaskManager(models.Manager):
    def active(self):
        return self.filter(status__name="In process")
    
class Board(models.Model):
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boards')

    def __str__(self):
        return self.title


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    priority = models.IntegerField(default=1)
    status = models.ForeignKey(TaskStatus, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    
    objects = TaskManager() 
    def __str__(self):
        return self.title
