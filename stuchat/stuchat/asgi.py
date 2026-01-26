import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# 🔥 STEP 1: settings sabse pehle
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "stuchat.settings")

# 🔥 STEP 2: Django ko manually setup karo
django.setup()

# 🔥 STEP 3: ab Django ASGI app safe hai
django_asgi_app = get_asgi_application()

# 🔥 STEP 4: ab routing import karo (safe now)
import chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter(
        chat.routing.websocket_urlpatterns
    ),
})
