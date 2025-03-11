from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import models
from . import serializers
from django.contrib.auth.models import User
class RatingView(APIView):  
    def get(self,request,pk):
        try:
            ratings = models.Rating.objects.filter(rated_user__username=pk)
            if not ratings.exists():
                return Response({'Error': 'No ratings found for this user'}, status=status.HTTP_404_NOT_FOUND)
            serializer = serializers.RatingSerializer(ratings, many=True)
            return Response({'data':serializer.data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self,request):
        try:
            serializer=serializers.RatingSerializer(data=request.data,context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({'Sucess':'Rating Giving Successfull'},status=status.HTTP_201_CREATED)
            else:
                return Response({'Error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def delete(self, request, id):
        try:
            rating = get_object_or_404(models.Rating, id=id)
            if rating.rating_user != request.user:
                return Response({"Error": "You can only delete your own ratings"}, status=status.HTTP_403_FORBIDDEN)
            rating.delete()
            return Response({"Success": "Rating deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)