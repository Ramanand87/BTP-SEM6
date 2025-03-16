from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from cloudinary.models import CloudinaryField

class CustomUser(AbstractUser):
    class Types(models.TextChoices):
        FARMER = "farmer", "Farmer"
        CONTRACTOR = "contractor", "Contractor"

    type = models.CharField(max_length=20, choices=Types.choices)
    groups = models.ManyToManyField(Group, related_name="custom_user_groups1", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions1", blank=True)
    def __str__(self):
        return self.username

class FarmerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="farmer_profile")
    name = models.CharField(max_length=100)
    address = models.TextField()
    phoneno = models.CharField(max_length=15, unique=True)
    image = CloudinaryField('image')
    screenshot = CloudinaryField('image', null=True, blank=True)
    aadhar_image = models.FileField(upload_to='aadhar/', null=True, blank=True)

    def __str__(self):
        return self.user.username

class ContractorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="contractor_profile")
    name = models.CharField(max_length=100)
    address = models.TextField()
    phoneno = models.CharField(max_length=15, unique=True)
    image = CloudinaryField('image')
    gstin = models.CharField(max_length=15, unique=True)
    aadhar_image = models.FileField(upload_to='aadhar/', null=True, blank=True)

    def __str__(self):
        return self.user.username
    
class Documents(models.Model):
    doc_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    doc = models.FileField(upload_to='documents/')

    def __str__(self):
        return self.doc_user.username