

from rest_framework import status
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import User
from .serializers import UserSearchSerializer
from .utils import generate_otp, send_otp_email
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False

            otp = generate_otp()
            user.otp = otp
            user.save()

            send_otp_email(user.email, otp)

            return Response(
                {"message": "OTP sent to email"},
                status=201
            )
        return Response(serializer.errors, status=400)


class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get("q", "")

        if not query:
            return Response([])

        users = User.objects.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query)
        ).exclude(id=request.user.id)[:20]

        serializer = UserSearchSerializer(users, many=True)
        return Response(serializer.data)


class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get("q", "")

        if not query:
            return Response([])

        users = User.objects.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query)
        ).exclude(id=request.user.id)[:20]

        serializer = UserSearchSerializer(users, many=True)
        return Response(serializer.data)
    
class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        try:
            user = User.objects.get(email=email, otp=otp)
            user.is_active = True
            user.otp = None
            user.save()
            return Response({"message": "OTP verified"})
        except User.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=400)
  
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # ✅ REQUIRED

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):   # 👈 PUT ❌ → PATCH ✅
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        u = User.objects.get(id=user_id)
        return Response({
            "id": u.id,
            "username": u.username,
            "profile_pic": u.profile_pic.url if u.profile_pic else None
        })
