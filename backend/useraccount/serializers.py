from rest_framework import serializers
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'avatar_url'
        )

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'email', 'avatar_url', 'bio'
        )

class CustomRegisterSerializer(RegisterSerializer):  
    username = None
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)

    def get_cleaned_data(self):
        return {
            'name': self.validated_data.get('name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }
        
    def save(self, request):
        # This ensures the 'name' field from the frontend gets saved 
        # to your custom User model's 'name' field
        user = super().save(request)
        user.name = self.validated_data.get('name', '')
        user.save()
        return user