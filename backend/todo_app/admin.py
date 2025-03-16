from django.contrib import admin
from .models import Task, UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_picture')
    search_fields = ('user__username',)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'completed', 'created_at', 'completed_at')
    list_filter = ('completed', 'created_at')
    search_fields = ('title', 'user__username')