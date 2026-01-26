import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# 1️⃣ sabse pehle settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "stuchat.settings")

# 2️⃣ Django ko manually initialize karo
django.setup()

# 3️⃣ ab safe hai
django_asgi_app = get_asgi_application()

# 4️⃣ ab routing import (VERY IMPORTANT yahin ho)
import chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter(
        chat.routing.websocket_urlpatterns
    ),
})
