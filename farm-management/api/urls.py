from django.urls import path
from .views import (
    CropListCreate,
    CropDetail,
    ResourceListCreate,
    ResourceDetail,
    ActivityListCreate,
    ActivityDetail,
    NotificationList,
    NotificationMarkRead,
    LoginView,
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('crops/', CropListCreate.as_view(), name='crop-list-create'),
    path('crops/<int:pk>/', CropDetail.as_view(), name='crop-detail'),
    path('resources/', ResourceListCreate.as_view(), name='resource-list-create'),
    path('resources/<int:pk>/', ResourceDetail.as_view(), name='resource-detail'),
    path('activities/', ActivityListCreate.as_view(), name='activity-list-create'),
    path('activities/<int:pk>/', ActivityDetail.as_view(), name='activity-detail'),
    path('notifications/', NotificationList.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', NotificationMarkRead.as_view(), name='notification-mark-read'),
]