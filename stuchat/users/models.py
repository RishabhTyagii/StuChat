from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    profile_pic = models.ImageField(
        upload_to="profile_pics/",
        blank=True,
        null=True
    )
    otp = models.CharField(max_length=6, blank=True, null=True)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
