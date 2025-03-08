from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

class Profile(models.Model):
    name=models.CharField(max_length=100)
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="prof_user")
    address=models.TextField()
    phoneno=models.CharField(max_length=15, unique=True)
    image=CloudinaryField('image')

    def __str__(self):
        return self.user.username

class Documents(models.Model):
    doc_user=models.ForeignKey(User,on_delete=models.CASCADE) 
    doc= models.FileField(upload_to='documents/')
    def __str__(self):
        return self.doc_user.username

    