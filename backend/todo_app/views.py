from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Task, UserProfile
from .serializers import UserSerializer, TaskSerializer, UserProfileSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class UploadProfilePictureView(APIView):
    def post(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            if 'profile_picture' not in request.FILES:
                return Response(
                    {"detail": "No image provided"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()
            
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        user = self.request.user
        completed = self.request.query_params.get('completed', None)
        
        queryset = Task.objects.filter(user=user)
        
        if completed is not None:
            completed = completed.lower() == 'true'
            queryset = queryset.filter(completed=completed)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        completed = serializer.validated_data.get('completed', instance.completed)
        
        # If task is being marked as completed, set completed_at
        if completed and not instance.completed:
            serializer.save(completed_at=timezone.now())
        # If task is being marked as not completed, clear completed_at
        elif not completed and instance.completed:
            serializer.save(completed_at=None)
        else:
            serializer.save()