from rest_framework import serializers
from .models import Task, Project, TaskStatus, User
from .models import Board

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskTitleSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    due_date = serializers.DateField()

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['title', 'color']


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email =serializers.CharField()
    password = serializers.CharField()

