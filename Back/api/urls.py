from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    
    path('register/', views.register_view, name='register'),
    path('users/', views.user_list, name='user-list'),
    #JWT
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    #FBV
    path('task-list/', views.task_list, name='task-list'),
    path('create/', views.create_task, name='create-task'),

    #CBV
    path('detail/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('create-cbv/', views.TaskCreateView.as_view(), name='task-create-cbv'),
]
