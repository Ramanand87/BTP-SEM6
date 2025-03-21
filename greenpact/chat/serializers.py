from rest_framework.serializers import ModelSerializer
from . import models
from user.serializers import userSerializers

class MessageSerializer(ModelSerializer):
    class Meta:
        model=models.ChatMessage
        fields='__all__'

class ChatRoomSerializer(ModelSerializer):
    participants = userSerializers(many=True) 
    class Meta:
        model=models.ChatRoom
        fields='__all__'
