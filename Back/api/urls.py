from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

router = DefaultRouter()
router.register(r'boards', views.BoardViewSet, basename='board')
router.register(r'columns', views.ColumnViewSet, basename='column')
urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('users/', views.user_list, name='user-list'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('task-list/', views.task_list, name='task-list'),
    path('task-list/<int:task_id>/', views.task_detail, name='task-detail'),
    path('create/', views.create_task, name='create-task'),
    path('detail/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('columns/<int:column_id>/tasks/', views.get_tasks_for_column, name='column-get-tasks'),
    
    # 💥 Важная строка
    path('', include(router.urls)),
]
