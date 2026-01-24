from django.urls import path
from .views import ProfileView, RegisterView, UserSearchView, VerifyOTPView, UserDetailView

urlpatterns = [
    path("", RegisterView.as_view(), name="register"),
    path("search/", UserSearchView.as_view(), name="user-search"),
    path("verify-otp/", VerifyOTPView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("user/<int:user_id>/", UserDetailView.as_view()),

]
