from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Profile(models.Model):
    name=models.CharField(max_length=100)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    address=models.TextField()
    phoneno=models.IntegerField()
    image=models.ImageField(upload_to='profile/')

    def __str__(self):
        return self.user.username

class Documents(models.Model):
    doc_user=models.ForeignKey(User,on_delete=models.CASCADE)
    doc=models.FileField(upload_to='documents/')

    def __str__(self):
        return self.doc_user.username

