from django.urls import path
from .views import ChatHistoryView, PendingChatsView

urlpatterns = [
      path("history/<int:user_id>/", ChatHistoryView.as_view()),
       path("pending/", PendingChatsView.as_view()),
]
