import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .auth import get_user_from_token
from .utils import get_room_name
from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            query = parse_qs(self.scope["query_string"].decode())
            token = query.get("token", [None])[0]

            user = await get_user_from_token(token)
            if not user:
                await self.close()
                return

            self.scope["user"] = user

            other_user_id = int(self.scope["url_route"]["kwargs"]["user_id"])
            room_name = get_room_name(user.id, other_user_id)
            self.room_group_name = f"chat_{room_name}"

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()

            # 🟢 ONLINE STATUS
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_status",
                    "user": self.scope["user"].username,
                    "status": "online",
                }
            )

        except Exception as e:
            print("WS CONNECT ERROR:", e)
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):

            # ⚪ OFFLINE STATUS
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_status",
                    "user": self.scope["user"].username,
                    "status": "offline",
                }
            )

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)

        # ✍️ TYPING EVENT
        if data.get("type") == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "sender": self.scope["user"].username,
                    "status": data.get("status"),
                }
            )
            return

        # ✔✔ READ RECEIPT EVENT
        if data.get("type") == "seen":
            await mark_messages_seen(
                self.room_group_name.replace("chat_", ""),
                self.scope["user"].id
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "read_receipt",
                    "user": self.scope["user"].username,
                }
            )
            return

        # 💬 MESSAGE EVENT
        message = data.get("message")
        if not message:
            return

        other_user_id = int(self.scope["url_route"]["kwargs"]["user_id"])
        room = self.room_group_name.replace("chat_", "")

        await save_message(
            sender=self.scope["user"],
            receiver_id=other_user_id,
            room=room,
            content=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": self.scope["user"].username,
            }
        )

    # 💬 MESSAGE SEND
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message": event["message"],
            "sender": event["sender"],
        }))

    # ✍️ TYPING STATUS
    async def typing_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "typing",
            "sender": event["sender"],
            "status": event["status"],
        }))

    # 🟢 ONLINE / OFFLINE
    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "status",
            "user": event["user"],
            "status": event["status"],
        }))

    # ✔✔ READ RECEIPT
    async def read_receipt(self, event):
        await self.send(text_data=json.dumps({
            "type": "seen",
            "user": event["user"],
        }))


# ================= DB HELPERS =================

@database_sync_to_async
def save_message(sender, receiver_id, room, content):
    Message.objects.create(
        sender=sender,
        receiver_id=receiver_id,
        room=room,
        content=content,
    )


@database_sync_to_async
def mark_messages_seen(room, user_id):
    Message.objects.filter(
        room=room,
        receiver_id=user_id,
        is_seen=False
    ).update(is_seen=True)
