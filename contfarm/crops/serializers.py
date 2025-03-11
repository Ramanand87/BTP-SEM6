from rest_framework.serializers import ModelSerializer
from . import models
from user.serializers import userSerializers

class CropsSeralizer(ModelSerializer):
    publisher=userSerializers(read_only=True)
    class Meta:
        model=models.Crops
        fields='__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['publisher'] = request.user
        return super().create(validated_data)