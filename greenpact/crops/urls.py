from django.urls import path
from . import views
urlpatterns = [
    path('detail/',views.CropView.as_view()),
    path('detail/<uuid:pk>',views.CropView.as_view()),
    path('detail/curr/',views.CurrUserCrops.as_view())
]
