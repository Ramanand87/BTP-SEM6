from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import ChatRoom, ChatMessage
from user.models import CustomUser

from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        messages = await self.get_chat_history(self.room_name)
        await self.send(text_data=json.dumps({
            'messages': messages
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']

        user = await self.get_user(username)
        room = await self.get_room(self.room_name)

        chat_message = await sync_to_async(ChatMessage.objects.create)(
            room=room,
            user=user,
            content=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': chat_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'timestamp': timestamp,
        }))

    @sync_to_async
    def get_user(self, username):
        return CustomUser.objects.get(username=username)

    @sync_to_async
    def get_room(self, room_name):
        return ChatRoom.objects.get(name=room_name)

    @sync_to_async
    def get_chat_history(self, room_name, limit=50):
        room = ChatRoom.objects.get(name=room_name)
        messages = ChatMessage.objects.filter(room=room).order_by('-timestamp').reverse()[:limit]
        return [
            {
                'username': message.user.username,
                'message': message.content,
                'timestamp': message.timestamp.isoformat()
            }
            for message in messages
        ]