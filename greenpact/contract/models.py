from django.db import models
from user.models import CustomUser
import uuid
from crops.models import Crops
from django.contrib.postgres.fields import ArrayField
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class Contract(models.Model):
    contract_id=models.UUIDField(primary_key = True,default=uuid.uuid4,editable=False)
    farmer = models.ForeignKey(CustomUser, related_name="farmer_contracts", on_delete=models.CASCADE)
    buyer = models.ForeignKey(CustomUser, related_name="buyer_contracts", on_delete=models.CASCADE)
    crop = models.ForeignKey(Crops, related_name="crop_detail", on_delete=models.CASCADE)
    nego_price=models.IntegerField()
    quantity=models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_address=models.TextField()
    delivery_date=models.DateField()
    terms = ArrayField(models.TextField(), blank=True, default=list)
    status=models.BooleanField(default=False)
    def __str__(self):
        return f"Contract {self.farmer} & {self.buyer}"

    def save(self, *args, **kwargs):
        """Override save method to send WebSocket notifications on contract creation"""
        super().save(*args, **kwargs)
        channel_layer = get_channel_layer()
        if not channel_layer:
            print("Channel Layer is None") 
            return
        farmer_contracts_count = Contract.objects.filter(farmer=self.farmer).count()
        buyer_contracts_count = Contract.objects.filter(buyer=self.buyer).count()
        async_to_sync(channel_layer.group_send)(
            f"contract_{self.farmer.username}",
            {
                "type": "contract_notification",
                "contract": farmer_contracts_count,
            },
        )

        async_to_sync(channel_layer.group_send)(
            f"contract_{self.buyer.username}",
            {
                "type": "contract_notification",
                "contract": buyer_contracts_count,
            },
        )

    def delete(self, *args, **kwargs):
        channel_layer = get_channel_layer()

        farmer_contracts_count = Contract.objects.filter(farmer=self.farmer).count() - 1
        buyer_contracts_count = Contract.objects.filter(buyer=self.buyer).count() - 1

        super().delete(*args, **kwargs)

        async_to_sync(channel_layer.group_send)(
            f"contract_{self.farmer.username}",
            {
                "type": "contract_notification",
                "contract": max(0, farmer_contracts_count), 
            },
        )

        async_to_sync(channel_layer.group_send)(
            f"contract_{self.buyer.username}",
            {
                "type": "contract_notification",
                "contract": max(0, buyer_contracts_count), 
            },
        )

class ContractDoc(models.Model):
    contract = models.ForeignKey(Contract, related_name="pdf_doc", on_delete=models.CASCADE)
    document = models.FileField(upload_to='contracts_pdfs/')

    def __str__(self):
        return f"PDF for Contract {self.contract.contract_id}"

class Transaction(models.Model):
    contract=models.ForeignKey(Contract,on_delete=models.CASCADE)
    receipt=models.FileField(upload_to="receipts")
    description=models.TextField(blank=True)
    date=models.DateField()
    amount=models.IntegerField(default=0)
    reference_number=models.CharField(max_length=255)

    def __str__(self):
        return f'receipt of {self.contract.contract_id}'

