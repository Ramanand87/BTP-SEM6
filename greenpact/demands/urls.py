from django.urls import path
from . import views
urlpatterns = [
    path('',views.DemandView.as_view()),
    path('<uuid:pk>',views.DemandView.as_view()),
    path('curr/',views.DemandCurrUser.as_view()),
]
