from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, ValidationError
from . import models
from rest_framework import serializers

class userSerializers(ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def get_role(self, obj):
        return obj.type 

    def validate(self, data):
        if models.CustomUser.objects.filter(username=data.get("username")).exists():
            raise ValidationError({'error': 'CustomUsername already taken'})
        elif models.FarmerProfile.objects.filter(phoneno=self.initial_data.get("phoneno")).exists() or \
             models.ContractorProfile.objects.filter(phoneno=self.initial_data.get("phoneno")).exists():
            raise ValidationError({'error': 'Phone no already taken'})
        elif not self.initial_data.get("documents"):
            raise ValidationError({'error': 'Documents empty'})
        return data

    def create(self, validated_data):
        print(self.initial_data.get("role"))
        user = models.CustomUser(username=validated_data["username"], type=self.initial_data.get("role"))
        user.set_password(validated_data["password"])
        user.save()

        profile_data = {
            "name": self.initial_data.get("name"),
            "phoneno": self.initial_data.get("phoneno"),
            "address": self.initial_data.get("address"),
            "image": self.initial_data.get("image"),
            "aadhaar_image":self.initial_data.get("aadhaar_image"),
            "user": user
        }
        if user.type == "farmer":
            profile_data["screenshot"] = self.initial_data.get("screenshot")
            models.FarmerProfile.objects.create(**profile_data)
        elif user.type == "contractor":
            profile_data["gstin"] = self.initial_data.get("gstin")
            models.ContractorProfile.objects.create(**profile_data)

        models.Documents.objects.create(doc_user=user, doc=self.initial_data.get("documents"))
        return user

class FarmerProfileSerializer(ModelSerializer):
    user = userSerializers()
    image = serializers.SerializerMethodField()
    screenshot = serializers.SerializerMethodField()

    class Meta:
        model = models.FarmerProfile 
        fields = '__all__'

    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
        return None

    def get_screenshot(self, obj):
        if obj.screenshot and hasattr(obj.screenshot, 'url'):
            return obj.screenshot.url
        return None

class ContractorProfileSerializer(ModelSerializer):
    user = userSerializers()
    image = serializers.SerializerMethodField()

    class Meta: 
        model = models.ContractorProfile
        fields = '__all__'

    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
        return None
