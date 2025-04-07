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
    document = serializers.SerializerMethodField()
    class Meta:
        model = models.ContractDoc
        fields = ["contract", "document"]
    def get_document(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.document.url)
        return obj.document.url

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model=models.Transaction
        fields='__all__'
        extra_kwargs = {
            'contract': {'required': False},
        }

    def create(self,validated_data):
        contract=get_object_or_404(models.Contract,contract_id=self.initial_data.get('contract_id'))
        validated_data['contract']=contract
        return models.Transaction.objects.create(**validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.receipt and request:
            data['receipt'] = request.build_absolute_uri(instance.receipt.url)
        elif instance.receipt:
            data['receipt'] = instance.receipt.url
        return data
    

class FarmerProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model=models.FarmerProgress
        fields="__all__"
        extra_kwargs = {
            'farmer': {'required': False},
            'contract': {'required': False},
        }

    def create(self, validated_data):
        request=self.context.get('request')
        if request.user.type == "contractor":
            return Response({'Error':'Contractor doesnot have permission'},status=status.HTTP_400_BAD_REQUEST)
        validated_data['farmer']=request.user
        contract=get_object_or_404(models.Contract,contract_id=self.initial_data.get('contract_id'))
        validated_data['contract']=contract
        return models.FarmerProgress.objects.create(**validated_data)
    
    def to_representation(self, instance):
        """ Ensure the full URL of crop_image is included in the GET response. """
        data = super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data
    

class TransactionListSerializer(serializers.ModelSerializer):
    contract_id = serializers.UUIDField(source='contract.contract_id', read_only=True)
    buyer_name = serializers.CharField(source='contract.buyer.username', read_only=True)
    receipt = serializers.SerializerMethodField()

    class Meta:
        model = models.Transaction
        fields = [
            "contract_id",
            "buyer_name",
            "receipt",
            "date",
            "amount",
            "reference_number",
            "description"
        ]

    def get_receipt(self, obj):
        return obj.receipt.url if obj.receipt else None
