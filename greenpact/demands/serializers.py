from rest_framework.serializers import ModelSerializer
from . import models
from user.models import ContractorProfile
from user.serializers import userSerializers,ContractorProfileSerializer
from rest_framework import serializers

class DemandSerializer(ModelSerializer):
    demand_user=userSerializers(read_only=True)
    crop_image=serializers.SerializerMethodField()
    contractor_profile=serializers.SerializerMethodField()
    class Meta:
        model=models.Demand
        fields="__all__"
    def get_contractor_profile(self,obj):
        cont_prof=ContractorProfile.objects.filter(user=obj.demand_user).first()
        if cont_prof:
            return ContractorProfileSerializer(cont_prof).data
        return None
    def get_crop_image(self, obj):
        if obj.crop_image and hasattr(obj.crop_image, 'url'):
            return obj.crop_image.url  
        return None
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['demand_user'] = request.user
        return models.Demand.objects.create(**validated_data)