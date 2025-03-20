from django.db import models
from user.models import CustomUser

class ChatRoom(models.Model):
    name = models.UUIDField()
    participants = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='chat_rooms',null=True)

class ChatMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
