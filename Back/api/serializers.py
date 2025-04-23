from rest_framework import serializers
from .models import Task, Project, User,Column
from .models import Board

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id','title', 'color']

class TaskTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'column', 'board', 'user']
    def create(self, validated_data):
        user = self.context['request'].user
        board = self.context['board']
        return Task.objects.create(user=user, board=board, **validated_data)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email =serializers.CharField()
    password = serializers.CharField()

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title']

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'