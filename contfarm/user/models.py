from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
# Create your models here.
class Profile(models.Model):
    name=models.CharField(max_length=100)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    address=models.TextField()
    phoneno=models.IntegerField()
    image=CloudinaryField('image')

    def __str__(self):
        return self.user.username

class Documents(models.Model):
    doc_user=models.ForeignKey(User,on_delete=models.CASCADE)
    doc= models.FileField(upload_to='documents/')
    def __str__(self):
        return self.doc_user.username

    