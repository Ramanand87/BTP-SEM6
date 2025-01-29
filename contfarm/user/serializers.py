from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer,ValidationError
from rest_framework.response import Response
from rest_framework import status
from . import models
class userSerializers(ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if self.initial_data.get("password1")!=data.get("password"):
            raise ValidationError({'error':'password does not match'})
        elif User.objects.filter(username=data.get("username")).exists():
            raise ValidationError({'error':'Username already taken'})
        elif models.Profile.objects.filter(phoneno=self.initial_data.get("phoneno")).exists():
            raise ValidationError({'error':'Phone no already taken'})
        elif not self.initial_data.get("documents"):
            raise ValidationError({'error':'Documents empty'})
        return data
    
    def create(self, validated_data):
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()

        profile_data = {
            "name": self.initial_data.get("name"),
            "phoneno": self.initial_data.get("phoneno"),
            "address": self.initial_data.get("address"),
            "image": self.initial_data.get("image"),
            "user": user
        }
        models.Profile.objects.create(**profile_data)

        models.Documents.objects.create(doc_user=user,doc=self.initial_data.get("documents"))
        return user