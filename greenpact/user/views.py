from django.shortcuts import render, get_object_or_404,get_list_or_404
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
        try:
            serializer = serializers.userSerializers(data=request.data)
            if serializer.is_valid():
                role = request.data.get("role")
                if role == "farmer":
                    aadhaar_image = request.FILES.get("aadhar_image")
                    if not aadhaar_image:
                        return Response({"error": "Aadhaar image is required"}, status=status.HTTP_400_BAD_REQUEST)
                elif role == "contractor":
                    gstin = request.data.get("gstin")
                    if not gstin:
                        return Response({"error": "GSTIN is required for contractors"}, status=status.HTTP_400_BAD_REQUEST)

                    if not validate_gstin(gstin):
                        return Response({"error": "Invalid GSTIN"}, status=status.HTTP_400_BAD_REQUEST)
                user = serializer.save()
                return Response({"success": "User registered successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class Login(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            user = authen(username, password)
            if user is not None:
                serial = serializers.userSerializers(user)
                role = user.type
                serialprof=None
                if role == "farmer":
                    farmer_profile = get_object_or_404(models.FarmerProfile, user=user)
                    if farmer_profile.is_verfied:
                        serialprof = serializers.FarmerProfileSerializer(farmer_profile,context={'request': request})
                    else:
                        return Response({'Error':'Wait for the admin to verify your profile'},status=status.HTTP_401_UNAUTHORIZED)
                elif role == "contractor":
                    contractor_profile = get_object_or_404(models.ContractorProfile, user=user)
                    serialprof = serializers.ContractorProfileSerializer(contractor_profile,context={'request': request})
                refresh = RefreshToken.for_user(user)
                return Response({
                    'Success': 'User Logged in Successfully',
                    'data':serial.data,
                    'role': user.type,
                    'profile':serialprof.data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            prof_user = get_object_or_404(CustomUser, username=pk)
            role = prof_user.type
            if role == "farmer":
                farmer_profile = get_object_or_404(models.FarmerProfile, user=prof_user)
                serial = serializers.FarmerProfileSerializer(farmer_profile,context={'request': request})
            elif role == "contractor":
                contractor_profile = get_object_or_404(models.ContractorProfile, user=prof_user)
                serial = serializers.ContractorProfileSerializer(contractor_profile,context={'request': request})
            else:
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'data': serial.data,'role':role}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def put(self, request):
        try:
        # print(request.data)
            user = request.user
            role = user.type
            if role == "farmer":
                farmer_profile = get_object_or_404(models.FarmerProfile, user=user)
                serializer = serializers.FarmerProfileSerializer(farmer_profile, data=request.data, partial=True,context={'request': request})
            elif role == "contractor":
                contractor_profile = get_object_or_404(models.ContractorProfile, user=user)
                serializer = serializers.ContractorProfileSerializer(contractor_profile, data=request.data, partial=True)
            else:
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class RegisteredFarmers(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            farmers=get_list_or_404(models.FarmerProfile,is_verfied=False)
            serialfarmer=serializers.FarmerProfileSerializer(farmers,many=True,context={'request': request})
            return Response({"data":serialfarmer.data},status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self,request,pk):
        try:
            user=get_object_or_404(CustomUser,username=pk)
            farmer=get_object_or_404(models.FarmerProfile,user=user)
            serial=serializers.FarmerProfileSerializer(farmer,data=request.data,partial=True)
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Farmer Verified'},status=status.HTTP_202_ACCEPTED)
            return Response(serial.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminLoginView(APIView):
    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")

            user = authen(username=username, password=password)
            if user is not None:
                if user.is_superuser:
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "role":"admin",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    })
                else:
                    return Response({"error": "Only superusers are allowed to log in."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AllUsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            farmers=models.FarmerProfile.objects.filter(is_verfied=True)
            contractors=models.ContractorProfile.objects.filter(is_verfied=True)
            serialfarmer=serializers.FarmerProfileSerializer(farmers,many=True,context={'request': request})
            serialcontractor=serializers.ContractorProfileSerializer(contractors,many=True,context={'request': request})
            return Response({"farmer":serialfarmer.data,"contractor":serialcontractor.data},status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
