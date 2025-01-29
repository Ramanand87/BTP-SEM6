from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('signup/',views.SignUp.as_view()),
    path('login/',views.Login.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
]
