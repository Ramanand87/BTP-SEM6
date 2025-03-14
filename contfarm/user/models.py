from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
import re

class Profile(models.Model):
    FARMER = "farmer"

    ROLE_CHOICES = [
        ('farmer', 'Farmer'),
        ('contractor', 'Contractor'),
    ]
    name = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    address = models.TextField()
    phoneno = models.CharField(max_length=15, unique=True)
    image = CloudinaryField('image')
    aadhar_image = models.FileField(upload_to='aadhar/', null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES,default=FARMER)
    screenshot = CloudinaryField('image', null=True, blank=True)
    isValid = models.BooleanField(default=False)
    gstin = models.CharField(max_length=15, null=True, blank=True, unique=True)
    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
    def save(self, *args, **kwargs):
        if self.role == "farmer":
            self.gstin = None
        elif self.role == "contractor":
            self.screenshot = None 
            self.isValid = False
        super().save(*args, **kwargs)

class Documents(models.Model):
    doc_user = models.ForeignKey(User, on_delete=models.CASCADE)
    doc = models.FileField(upload_to='documents/')

    def __str__(self):
        return self.doc_user.username
