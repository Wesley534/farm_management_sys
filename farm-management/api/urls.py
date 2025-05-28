
from django.urls import path
from .views import (
    CropListCreate, CropDetail, ResourceListCreate, ActivityListCreate, LoginView
)

urlpatterns = [
    path('crops/', CropListCreate.as_view(), name='crop-list'),
    path('crops/<int:pk>/', CropDetail.as_view(), name='crop-detail'),
    path('resources/', ResourceListCreate.as_view(), name='resource-list'),
    path('activities/', ActivityListCreate.as_view(), name='activity-list'),
    path('login/', LoginView.as_view(), name='login'),
]
