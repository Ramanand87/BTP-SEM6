import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greenpact.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat import routing
from chat.middleware import JWTAuthMiddleware  

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JWTAuthMiddleware(  
        URLRouter(
            routing.websocket_urlpatterns
        )
    )
})
