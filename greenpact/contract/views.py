from django.shortcuts import render,get_object_or_404,get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import models
from django.db.models import Sum
from . import serializers
from django.http import Http404
import re

class ContractView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk=None):
        try:
            if pk is None:
                role=request.user.type
                if(role=="farmer"):
                    contract=get_list_or_404(models.Contract,farmer=request.user)
                else:
                    contract=get_list_or_404(models.Contract,buyer=request.user)
                serial=serializers.ContractSerializer(contract,many=True)
                return Response({'data':serial.data},status=status.HTTP_200_OK)
            else:
                contract=get_object_or_404(models.Contract,contract_id=pk)
                serial=serializers.ContractSerializer(contract)
                return Response({'data':serial.data},status.HTTP_200_OK)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self, request):
        try:
            serial=serializers.ContractSerializer(data=request.data,context={'request':request})
            if serial.is_valid():
                serial.save()
                return Response({"Success":"Contract Successfully Created"},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self,request,pk):
        try:
            role=request.user.type
            if role=="farmer":
                return Response({"Acess Denied":"You cannot change the Contract"},status=status.HTTP_400_BAD_REQUEST)
            contract=get_object_or_404(models.Contract,contract_id=pk)
            serial=serializers.ContractSerializer(contract,data=request.data,partial=True)
            if serial.is_valid():
                serial.save()
                contract.save()
                return Response({"Sucess":"Contract Updated"},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            contract.delete()
            return Response({'Sucess':'Contract Deleted'},status=status.HTTP_200_OK)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TransactionView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            transaction=get_list_or_404(models.Transaction,contract=contract)
            serial=serializers.TransactionSerializer(transaction,many=True, context={'request': request})
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self,request):
        try:
            serial=serializers.TransactionSerializer(data=request.data)
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Transaction added'},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self,request,pk):
        try:
            transaction=get_object_or_404(models.Transaction,id=pk)
            serial=serializers.TransactionSerializer(transaction,data=request.data,partial=True)
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Transaction Updated'},status=status.HTTP_200_OK)
            return Response({'Error':serial.errors},status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self,request,pk):
        try:
            transaction=get_object_or_404(models.Transaction,id=pk)
            transaction.delete()
            return Response({'Sucess':'Transaction deleted'},status=status.HTTP_200_OK)
        except Http404:
            return Response({'Error': 'No Contract found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContractDocView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk=None):
        try:
            contractDoc=get_object_or_404(models.ContractDoc,contract__contract_id=pk)
            serial=serializers.ContractDocSerializer(contractDoc,context={'request':request})
            return Response({'data':serial.data},status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetProgressView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(sel,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            total_paid = models.Transaction.objects.filter(contract=contract).aggregate(total=Sum('amount'))['total'] or 0
            total_price=contract.nego_price*contract.quantity 
            remaining_amount = total_price - total_paid
            return Response({
                "contract_id": str(contract.contract_id),
                "total_price": total_price,
                "total_paid": total_paid,
                "remaining_amount": remaining_amount,
                "payment_complete": remaining_amount <= 0
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FarmerProgressView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        try:
            contract=get_object_or_404(models.Contract,contract_id=pk)
            progress=get_list_or_404(models.FarmerProgress,contract=contract)
            serial=serializers.FarmerProgressSerializer(progress,many=True)
            return Response({'data':serial.data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        try:
            serial=serializers.FarmerProgressSerializer(data=request.data,context={'request':request})
            if serial.is_valid():
                serial.save()
                return Response({'Sucess':'Progress Saved'},status=status.HTTP_201_CREATED)
            return Response(serial.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self,request,pk):
        try:
            progress=get_object_or_404(models.FarmerProgress,id=pk)
            progress.delete()
            return Response({'Sucess':'Progress Deleted'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)