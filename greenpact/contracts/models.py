from django.db import models
from user.models import CustomUser
import uuid
from crops.models import Crops
class Contract(models.Model):
    contract_id=models.UUIDField(primary_key = True,default=uuid.uuid4,editable=False)
    farmer = models.ForeignKey(CustomUser, related_name="farmer_contracts", on_delete=models.CASCADE)
    buyer = models.ForeignKey(CustomUser, related_name="buyer_contracts", on_delete=models.CASCADE)
    crop = models.ForeignKey(Crops, related_name="crop_detail", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_address=models.TextField()
    delivery_date=models.DateField()
    term=models.TextField(blank=True)
    def __str__(self):
        return f"Contract {self.farmer} & {self.buyer}"

class ContractDoc(models.Model):
    contract = models.ForeignKey(Contract, related_name="documents", on_delete=models.CASCADE)
    document = models.FileField(upload_to='contracts/')

    def __str__(self):
        return f"Document for {self.contract.contract_id}"