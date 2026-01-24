from django.shortcuts import render
from django.db.models import Count, Max
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message
from rest_framework.permissions import IsAuthenticated
from .utils import get_room_name
from django.db import models

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = request.user
        room = get_room_name(user.id, user_id)

        # ✅ FIX: mark messages as seen WHEN chat opens
        Message.objects.filter(
            room=room,
            receiver=user,
            is_seen=False
        ).update(is_seen=True)

        msgs = (
            Message.objects
            .filter(room=room)
            .select_related("sender")
            .order_by("timestamp")
        )

        data = [
            {
                "content": m.content,
                "sender": m.sender.username,
                "is_seen": m.is_seen,
                "timestamp": m.timestamp,
            }
            for m in msgs
        ]

        return Response(data)


from django.db.models import Count, Max, Q
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Message


class PendingChatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        qs = (
            Message.objects
            .filter(receiver=user)
            .values("sender")
            .annotate(
                unread_count=Count("id", filter=Q(is_seen=False)),
                last_time=Max("timestamp"),
            )
            .order_by("-last_time")
        )

        data = []

        for row in qs:
            last_msg = (
                Message.objects
                .filter(sender_id=row["sender"], receiver=user)
                .select_related("sender")
                .order_by("-timestamp")
                .first()
            )

            sender = last_msg.sender

            data.append({
                "user_id": sender.id,
                "username": sender.username,
                "profile_pic": (
                    sender.profile_pic.url
                    if sender.profile_pic
                    else None
                ),
                "last_message": last_msg.content,
                "last_time": last_msg.timestamp,
                "unread_count": row["unread_count"],
            })

        return Response(data)
