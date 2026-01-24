from django.urls import re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"^chat/(?P<user_id>\d+)/$", ChatConsumer.as_asgi()),
]
