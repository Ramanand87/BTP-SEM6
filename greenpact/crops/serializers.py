from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from . import models
from user.models import FarmerProfile
from user.serializers import userSerializers,FarmerProfileSerializer

class CropsSeralizer(ModelSerializer):
    publisher=userSerializers(read_only=True)
    publisher_profile = serializers.SerializerMethodField()
    # crop_image=serializers.SerializerMethodField()
    class Meta:
        model=models.Crops
        fields='__all__'

    def get_publisher_profile(self, obj):
        contractor_profile = FarmerProfile.objects.filter(user=obj.publisher).first()
        if contractor_profile:
            return FarmerProfileSerializer(contractor_profile).data
        return None
    
    def to_representation(self, instance):
        """ Ensure the full URL of crop_image is included in the GET response. """
        data = super().to_representation(instance)
        if instance.crop_image:
            data['crop_image'] = instance.crop_image.url
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['publisher'] = request.user
        return super().create(validated_data)