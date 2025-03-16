from rest_framework.serializers import ModelSerializer
from . import models
from user.serializers import userSerializers

class CropsSeralizer(ModelSerializer):
    publisher=userSerializers(read_only=True)
    class Meta:
        model=models.Crops
        fields='__all__'
    
    def get_crop_image(self, obj):
        if obj.crop_image and hasattr(obj.crop_image, 'url'):
            return obj.crop_image.url  
        return None
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.crop_image:
            data["crop_image"] = f"https://res.cloudinary.com/dgr9zq2an/{instance.crop_image}"
        return data
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['publisher'] = request.user
        return super().create(validated_data)