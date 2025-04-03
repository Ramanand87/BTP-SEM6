from django.urls import path
from . import views
urlpatterns = [
    path('',views.ContractView.as_view()),
    path('<uuid:pk>/',views.ContractView.as_view()),
]
