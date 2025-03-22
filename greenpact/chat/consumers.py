from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import ChatRoom, ChatMessage, Notification
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

        await self.notify_users(room, message, username)

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

    async def notify_users(self, room, message, sender):
        sender_user = await self.get_user(sender)
        participants = await sync_to_async(list)(room.participants.exclude(username=sender))

        for participant in participants:
            await sync_to_async(Notification.objects.create)(
                user=participant,
                sender=sender_user,
                room=room,
                message=message,
                is_read=False
            )
            notification_group_name = f'notifications_{participant.username}'
            await self.channel_layer.group_send(
                notification_group_name,
                {
                    'type': 'send_notification',
                    'message': f'New message in {room.name} from {sender}: {message}',
                    'sender': sender
                }
            )
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'notification': event['message'],
            'sender': event['sender'],
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

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.notification_group_name = f'notifications_{self.user.username}'
            await self.channel_layer.group_add(
                self.notification_group_name,
                self.channel_name
            )
            await self.accept()

            # ✅ Fetch unread notifications when user reconnects
            unread_notifications = await self.get_unread_notifications(self.user)
            await self.send(text_data=json.dumps({
                'unread_notifications': unread_notifications
            }))
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )

    async def send_notification(self, event):
        """ Send real-time notifications to connected users """
        await self.send(text_data=json.dumps({
            'notification': event['message'],
            'sender': event['sender'],
        }))

    @sync_to_async
    def get_unread_notifications(self, user):
        """ Get unread notifications for an offline user when they reconnect """
        notifications = Notification.objects.filter(user=user, is_read=False)
        return [
            {'message': n.message, 'sender': n.sender.username, 'timestamp': n.timestamp.isoformat()}
            for n in notifications
        ]