
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Crop, Resource, Activity
from .serializers import CropSerializer, ResourceSerializer, ActivitySerializer

class CropListCreate(generics.ListCreateAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

class CropDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

class ResourceListCreate(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

class ActivityListCreate(generics.ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print("Login request data:", request.data)
        username = request.data.get('username')
        password = request.data.get('password')
        print("Attempting to authenticate:", username)
        user = authenticate(username=username, password=password)
        print("Authenticated user:", user)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
