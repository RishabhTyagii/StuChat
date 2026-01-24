import random
from django.core.mail import send_mail

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    send_mail(
        subject="StuChat OTP Verification",
        message=f"Your OTP is {otp}",
        from_email="noreply@stuchat.com",
        recipient_list=[email],
        fail_silently=False,
    )
