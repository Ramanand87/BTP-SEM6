from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import serializers
from . import models
from utils.userauth import verify, validate_gstin,authen
from rest_framework_simplejwt.tokens import RefreshToken
from user.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import os

class SignUp(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        serializer = serializers.userSerializers(data=request.data)
        if serializer.is_valid():
            role = request.data.get("role")
            if role == "farmer":
                aadhaar_image = request.FILES.get("aadhaar_image")
                if not aadhaar_image:
                    return Response({"error": "Aadhaar image is required"}, status=status.HTTP_400_BAD_REQUEST)
                user_data = {
                    "name": request.data.get("name"),
                    "dob": request.data.get("dob"),
                }
                image_path = f"temp_{aadhaar_image.name}"
                with open(image_path, "wb") as img_file:
                    img_file.write(aadhaar_image.read())
                if not verify(user_data,image_path):
                    return Response({"error": "Aadhaar details do not match"}, status=status.HTTP_400_BAD_REQUEST)
                os.remove(image_path)
            elif role == "contractor":
                gstin = request.data.get("gstin")
                if not gstin:
                    return Response({"error": "GSTIN is required for contractors"}, status=status.HTTP_400_BAD_REQUEST)

                if not validate_gstin(gstin):
                    return Response({"error": "Invalid GSTIN"}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save()
            return Response({"success": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Login(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authen(username, password)
        if user is not None:
            serial = serializers.userSerializers(user)
            role = user.type
            serialprof=None
            if role == "farmer":
                farmer_profile = get_object_or_404(models.FarmerProfile, user=user)
                serialprof = serializers.FarmerProfileSerializer(farmer_profile)
            elif role == "contractor":
                contractor_profile = get_object_or_404(models.ContractorProfile, user=user)
                serialprof = serializers.ContractorProfileSerializer(contractor_profile)
            refresh = RefreshToken.for_user(user)
            return Response({
                'Success': 'User Logged in Successfully',
                'data': serial.data,
                'role': user.type,
                'profile':serialprof.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        prof_user = get_object_or_404(CustomUser, username=pk)
        role = prof_user.type
        if role == "farmer":
            farmer_profile = get_object_or_404(models.FarmerProfile, user=prof_user)
            serial = serializers.FarmerProfileSerializer(farmer_profile)
        elif role == "contractor":
            contractor_profile = get_object_or_404(models.ContractorProfile, user=prof_user)
            serial = serializers.ContractorProfileSerializer(contractor_profile)
        else:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'data': serial.data}, status=status.HTTP_200_OK)

    def put(self, request, pk=None):
        user = request.user
        role = user.type
        if role == "farmer":
            farmer_profile = get_object_or_404(models.FarmerProfile, user=user)
            serializer = serializers.FarmerProfileSerializer(farmer_profile, data=request.data, partial=True)
        elif role == "contractor":
            contractor_profile = get_object_or_404(models.ContractorProfile, user=user)
            serializer = serializers.ContractorProfileSerializer(contractor_profile, data=request.data, partial=True)
        else:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)