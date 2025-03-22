from django.urls import re_path, path
from channels.routing import ProtocolTypeRouter, URLRouter
from .middleware import JWTAuthMiddleware
from .consumers import NotificationConsumer, ChatConsumer
import jwt
from django.conf import settings

# Define WebSocket URL patterns
websocket_urlpatterns = [
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),  
    path("ws/chat/<str:room_name>/", ChatConsumer.as_asgi()),  # Include ChatConsumer
]
