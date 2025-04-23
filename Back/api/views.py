from collections import defaultdict
import logging
from urllib import request
from venv import logger
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny

from django.contrib.auth import authenticate


from .models import Column, Task, User,Board
from .serializers import  ColumnSerializer  # нужно создать

from .serializers import BoardSerializer, TaskSerializer, TaskTitleSerializer, UserLoginSerializer,UserRegisterSerializer
from django.http import JsonResponse

from .serializers import serializers

logger = logging.getLogger(__name__)    




def task_list(request):
    tasks = Task.objects.all() 
    task_data = [{"id": task.id, "title": task.title} for task in tasks]
    return JsonResponse(task_data, safe=False)

#FBV
@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)   
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])  # 👈 Вот так правильно
def register_view(request):
    print("lox")
    print("Request data:", request.data) 
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not email or not password:
        return Response({'error': 'All fields are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully.'}, status=201)

@api_view(['GET'])  # Только для админов, можно убрать для тестов
def user_list(request):
    User = get_user_model()
    users = User.objects.all().values('id', 'username', 'email','password')
    return Response(list(users))

@api_view(['POST'])
def login_view(request):
    print("Request data:", request.data)  # ⬅️ Временный вывод
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)
    
    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        return Response({
            'access': access_token,
            'refresh': refresh_token,
            'user_id': user.id
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)
    
@api_view(['POST'])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user) 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#CBV
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated] 


    @action(detail=True, methods=['post'], url_path='add-task')
    def add_task(self, request, pk=None):
        board = self.get_object()
        serializer = TaskTitleSerializer(data=request.data, context={'request': request, 'board': board})
        if serializer.is_valid():
            task = serializer.save()
            return Response(TaskTitleSerializer(task).data, status=201)
        return Response(serializer.errors, status=400)
    

    def get_queryset(self):
        # Возвращаем только доски текущего пользователя
        return Board.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Автоматически привязываем текущего пользователя
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        logger.info(f"Auth header: {request.headers.get('Authorization')}")
        logger.info(f"User: {request.user}")
        return super().create(request, *args, **kwargs)
    
    def board_tasks(self, request, pk=None):
        try:
            board = Board.objects.get(title=pk)
        except Board.DoesNotExist:
            return Response({'error': 'Board not found'}, status=404)

        if request.method == 'GET':
            tasks = board.tasks.all()
            serializer = TaskTitleSerializer(tasks, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = TaskTitleSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, board=board)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        
  
def task_detail(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        return JsonResponse({
            'id': task.id,
            'title': task.title,
            'column': task.column.id,
            'board': task.board.id,
            'user': task.user.id,
        })
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)

@api_view(['DELETE'])
def delete_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_tasks_for_column(request, column_id):
    try:
        column = Column.objects.get(id=column_id, board__user=request.user)  # Проверка на принадлежность колонки пользователю
        tasks = Task.objects.filter(column=column)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    except Column.DoesNotExist:
        return Response({'error': 'Column not found or you do not have access to this column.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def delete_board(request,title):
    try:
        board = Board.objects.get(title=title, user=request.user)  # Проверяем владельца
        board.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Board.DoesNotExist:
        return Response(
            {"error": "Доска не найдена или у вас нет прав на её удаление"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'success': 'Logged out'}, status=204)


@api_view(['GET'])
def board_content(request, title):
    tasks = Task.objects.filter(board__title=title)
    grouped = defaultdict(list)

    for task in tasks:
        grouped[task.column].append(TaskSerializer(task).data)

    return Response(grouped)


class ColumnViewSet(viewsets.ModelViewSet):
    print("lox")
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['board'] 

    def get_queryset(self):
        return Column.objects.filter(board__user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        print("📨 Request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Ошибки сериализатора:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        board = serializer.validated_data['board']
        if board.user != self.request.user:
            raise serializers.ValidationError("You do not have permission to add columns to this board.")
        serializer.save()
