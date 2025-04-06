from django.urls import path
from . import views
urlpatterns = [
    path('',views.ContractView.as_view()),
    path('<uuid:pk>/',views.ContractView.as_view()),
    path('pdf/<uuid:pk>/',views.ContractDocView.as_view()),
    path('transaction/<uuid:pk>/',views.TransactionView.as_view()),
    path('transaction/',views.TransactionView.as_view()),
    path('progress/<uuid:pk>/',views.GetProgressView.as_view()),
]
