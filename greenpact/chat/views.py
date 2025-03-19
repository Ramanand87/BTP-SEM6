from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models
from . import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# Create your views here.
class MessagesView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            messages = models.ChatMessage.objects.filter(chatroom_name=pk)
            data = [{'sender': msg.sender.username, 'content': msg.content, 'timestamp': msg.timestamp} for msg in messages]
            return Response({'data':data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_200_OK)


class ChatRoomView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            rooms=models.ChatRoom.objects.filter(user=request.user)
            serial=serializers.ChatRoomSerailizer(rooms,many=True)
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_200_OK)
    def post(self,request):
        try:
            username=request.data.get('username')
            roomname=request.user.username + "-" + username
            models.ChatRoom.objects.create(name=roomname,user=request.user)
            new_user=models.CustomUser.objects.get(username=username)
            models.ChatRoom.objects.create(name=roomname,user=new_user)
            return Response({'Sucess':'Room Created','name':roomname},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_200_OK)
