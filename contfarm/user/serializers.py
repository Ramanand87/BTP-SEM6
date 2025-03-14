import time
import requests
import os
from dotenv import load_dotenv
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from . import models

load_dotenv()
GSTIN_API_URL = "https://gstincheck.co.in/api/gstin/"
GSTIN_API_KEY = os.getenv("GSTIN_API_KEY")

class userSerializers(ModelSerializer):
    gstin = serializers.CharField(required=False, allow_blank=True)
    documents = serializers.FileField(write_only=True)
    class Meta:
        model = User
        fields = ["username", "email", "password", "gstin", "documents"]
        extra_kwargs = {"password": {"write_only": True}}
    def validate(self, data):
        errors = {}
        role = self.initial_data.get("role")
        gstin = self.initial_data.get("gstin", "").strip()
        if User.objects.filter(username=data.get("username")).exists():
            errors["username"] = "Username already taken"
        if models.Profile.objects.filter(phoneno=self.initial_data.get("phoneno")).exists():
            errors["phoneno"] = "Phone number already taken"
        if "documents" not in self.initial_data:
            errors["documents"] = "Documents cannot be empty"
        if role == "contractor":
            if not gstin:
                errors["gstin"] = "GSTIN is required for contractors."
            else:
                headers = {
                    "Authorization": f"Bearer {GSTIN_API_KEY}",
                    "Content-Type": "application/json"
                }

                for attempt in range(3):
                    response = requests.get(f"{GSTIN_API_URL}{gstin}", headers=headers)
                    if response.status_code == 200:
                        break  
                    elif attempt < 2:
                        time.sleep(2)
                    else:
                        errors["gstin"] = "Invalid GSTIN after multiple attempts."
        else:
            if gstin:
                errors["gstin"] = "Farmers should not provide GSTIN."
        if errors:
            raise ValidationError(errors)
        return data

    def create(self, validated_data):
        gstin = validated_data.pop("gstin", None)
        documents = self.initial_data.get("documents")
        role = self.initial_data.get("role")
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        profile_data = {
            "name": self.initial_data.get("name"),
            "phoneno": self.initial_data.get("phoneno"),
            "address": self.initial_data.get("address"),
            "image": self.initial_data.get("image"),
            "user": user,
            "role": role,
        }
        if role == "contractor":
            profile_data["gstin"] = gstin
        models.Profile.objects.create(**profile_data)
        models.Documents.objects.create(doc_user=user, doc=documents)
        return user

class ProfileSerializer(ModelSerializer):
    user = userSerializers()

    class Meta:
        model = models.Profile
        fields = '__all__'
