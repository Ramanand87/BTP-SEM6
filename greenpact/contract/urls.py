from django.urls import path
from . import views
urlpatterns = [
    path('',views.ContractView.as_view()),
]
