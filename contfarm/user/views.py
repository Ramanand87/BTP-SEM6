from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import serializers
from utlis import userauth
from rest_framework_simplejwt.tokens import RefreshToken
class SignUp(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self,request):
        serializer = serializers.userSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'Sucess':'User registered sucessfully'},status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Login(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self,request):
        username=request.data.get('username')
        password=request.data.get('password')
        user=userauth.authen(username,password)
        if user is not None:
            serial=serializers.userSerializers(user)
            refresh=RefreshToken.for_user(user)
            return Response({'Sucess':'User Logged in Sucessfully','data':serial.data,'refresh':str(refresh),'access':str(refresh.access_token)},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'error':'Invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
            