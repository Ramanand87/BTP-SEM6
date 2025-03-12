from rest_framework.serializers import ModelSerializer,SerializerMethodField
from rest_framework import serializers
from . import models
from django.contrib.auth.models import User

class RatingSerializer(ModelSerializer):
    rated_user = SerializerMethodField()
    rating_user = SerializerMethodField()
    class Meta:
        model=models.Rating
        fields='__all__'
    
    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url  
        return None
    def get_rated_user(self, obj):
        return obj.rated_user.username

    def get_rating_user(self, obj):
        return obj.rating_user.username

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['rating_user'] = request.user
            rated_user_username = request.data.get('rated_user')
            try:
                validated_data['rated_user'] = User.objects.get(username=rated_user_username)
            except User.DoesNotExist:
                raise serializers.ValidationError({"rated_user": "User not found."})
        return super().create(validated_data)