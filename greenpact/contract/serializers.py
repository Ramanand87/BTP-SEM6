from rest_framework import serializers
from . import models
from user.models import CustomUser
from crops.models import Crops
# from user.serializers import userSerializers
# from crops.serializers import CropsSerializer
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

class ContractSerializer(serializers.ModelSerializer):
    farmer_name = serializers.SerializerMethodField()
    buyer_name = serializers.SerializerMethodField()
    crop_name = serializers.SerializerMethodField()
    terms = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    class Meta:
        model = models.Contract
        fields = [
            'contract_id',
            'farmer_name',
            'buyer_name',
            'crop_name',
            'nego_price',
            'quantity',
            'created_at',
            'delivery_address',
            'delivery_date',
            'terms',
            'status',
        ]
    def get_farmer_name(self, obj):
        try:
            return obj.farmer.farmer_profile.name
        except AttributeError:
            return obj.farmer.username 

    def get_buyer_name(self, obj):
        try:
            return obj.buyer.contractor_profile.name
        except AttributeError:
            return obj.buyer.username
    def get_crop_name(self, obj):
        return obj.crop.crop_name 
    def create(self,validated_data):
        try:
            request = self.context.get('request')
            if request and request.user:
                validated_data['buyer'] = request.user
            validated_data['farmer'] =get_object_or_404(CustomUser,username=self.initial_data.get('farmer_username'))
            validated_data['crop'] = get_object_or_404(Crops,crop_id=self.initial_data.get('crop_id'))
            return models.Contract.objects.create(**validated_data)
        except Http404:
                return Response({'Error': 'Cant Create Contract'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        

class ContractDocSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContractDoc
        fields = ["id", "contract", "document"]
