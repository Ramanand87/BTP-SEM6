from django.db import models
from user.models import CustomUser
from uuid import uuid4
from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model

class Rating(models.Model):
    RATING_CHOICES = [
        (1,'1'), 
        (2,'2'), 
        (3,'3'), 
        (4,'4'), 
        (5,'5'), 
    ]
    id=models.UUIDField(default=uuid4,primary_key=True,editable=False)
    rated_user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="received_ratings")
    rating_user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="given_ratings")
    description=models.TextField(blank=True)
    images=CloudinaryField('image',blank=True)
    rate=models.IntegerField(choices=RATING_CHOICES)

    def __str__(self):
        return f'{self.rating_user.username} rated {self.rated_user.username}'


