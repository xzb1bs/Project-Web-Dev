import logging
from venv import logger
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from django.contrib.auth import authenticate


from .models import Task, User,Board
from .serializers import UserSerializer  # нужно создать

from .serializers import BoardSerializer, TaskSerializer, TaskTitleSerializer, UserLoginSerializer,UserRegisterSerializer
from django.http import JsonResponse

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
    permission_classes = [permissions.IsAuthenticated]

class TaskCreateView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]  # Только для авторизованных

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
    

    
#JWT
# @api_view(['POST', 'GET'])
# def login_view(request):
#     serializer = UserLoginSerializer(data=request.data)
#     serializer.is_valid(raise_exception=True)
#     user = authenticate(
#         username=serializer.validated_data['username'],
#         password=serializer.validated_data['password']
#     )
#     if user:
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#         })
#     return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'success': 'Logged out'}, status=204)
