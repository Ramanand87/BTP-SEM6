from rest_framework.serializers import ModelSerializer
from . import models

class RatingSerializer(ModelSerializer):
    class Meta:
        model=models.Rating
        fields='__all__'