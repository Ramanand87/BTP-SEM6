from django.shortcuts import render,get_object_or_404,get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import models
from . import serializers

class CropView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request,pk=None):
        if pk is None:
            try:
                crops=models.Crops.objects.all()
                serial=serializers.CropsSeralizer(crops,many=True)
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            try: 
                crops=get_object_or_404(models.Crops,crop_id=pk)
                serial=serializers.CropsSeralizer(crops)
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        try:
            serial=serializers.CropsSeralizer(data=request.data,context={'request': request})
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Crop Advertisement Created'},status=status.HTTP_201_CREATED)
            else:
                return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self,request,pk):
        crop=get_object_or_404(models.Crops,crop_id=pk)
        crop.delete()
        return Response({'Sucess':'Deleted Sucessfully'},status=status.HTTP_204_NO_CONTENT)

class CurrUserCrops(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            crops=get_list_or_404(models.Crops,publisher=request.user)
            serial=serializers.CropsSeralizer(crops,many=True)
            return Response(serial.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)