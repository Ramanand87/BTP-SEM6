from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import datetime    

class Crops(models.Model):
    crop_id=models.UUIDField(primary_key = True,default=uuid.uuid4,editable=False)
    crop_name=models.CharField(max_length=256) 
    publisher=models.ForeignKey(User,on_delete=models.CASCADE)
    crop_image=models.ImageField(upload_to='crop_images/')
    crop_price=models.IntegerField()
    quantity=models.IntegerField()
    Description=models.TextField(max_length=200)
    harvested_time=models.DateField()
    location=models.TextField(max_length=150)
