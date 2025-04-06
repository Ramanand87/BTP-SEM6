from channels.generic.websocket import AsyncWebsocketConsumer
from user.models import CustomUser
from rest_framework_simplejwt.tokens import AccessToken
from . import models,serializers
import json
from asgiref.sync import sync_to_async
import requests
from django.core.files.base import ContentFile
from django.conf import settings

class ContractConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user=None
        await self.accept()

    async def receive(self, text_data):
        try:
            data=json.loads(text_data)
            action=data.get("action")
            token=data.get("token",None)

            if token:
                self.user=await self.authenticate_user(token)
            if self.user:
                self.contract_groupname=f'contract_{self.user.username}'
                await self.channel_layer.group_add(
                    self.contract_groupname,
                    self.channel_name
                )
                if action=="fetch_contracts":
                    contracts = await self.get_contracts()
                    await self.send(text_data=json.dumps({"data": contracts}))
                elif action=="approve_contracts":
                    if self.user.type=="farmer":
                        await self.approve_contract(data)
                    else:
                        await self.send(text_data=json.dumps({"error":"You cant approve this contract wait for seller to approve"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def disconnect(self, close_code):
        if self.user:
            await self.channel_layer.group_discard(self.contract_groupname, self.channel_name)
    @sync_to_async
    def authenticate_user(self, token):
        try:
            access_token = AccessToken(token)
            return CustomUser.objects.get(id=access_token["user_id"])
        except Exception:
            return None

    @sync_to_async
    def get_contracts(self):
        try:
            if self.user.type=="farmer":
                contracts=models.Contract.objects.filter(farmer=self.user)
                return serializers.ContractSerializer(contracts,many=True).data
            else:
                contracts=models.Contract.objects.filter(buyer=self.user)
                return serializers.ContractSerializer(contracts,many=True).data
        except Exception:
            return None
        
    @sync_to_async
    def update_contracts(self, data):
        try:
            serial=serializers.ContractSerializer(data=data,partial=True)
            if serial.is_valid():
                serial.save()
                return None
        except Exception:
            return None

    @sync_to_async
    def approve_contract(self, data):
        try:
            contract = models.Contract.objects.get(contract_id=data["contract_id"])
            contract.status = True
            contract.save()
            farmer_profile = contract.farmer.farmer_profile
            contractor_profile = contract.buyer.contractor_profile
            payload = {
                "orderId": "ORD12345",
                "orderDate": "2025-04-02",
                "farmerName": farmer_profile.name,
                "farmerAddress": farmer_profile.address,
                "farmerContact": farmer_profile.phoneno,
                "customerName": contractor_profile.name,
                "customerAddress": contractor_profile.address,
                "customerContact": contractor_profile.phoneno,
                "cropName": contract.crop.name,
                "quantity": contract.quantity,
                "pricePerUnit": contract.nego_price,
                "totalAmount": contract.quantity * contract.nego_price,
                "orderId": str(contract.contract_id)[:8],
                "contractId": str(contract.contract_id),
                "deliveryDate": contract.delivery_date.strftime("%Y-%m-%d"),
                "deliveryLocation": contract.delivery_address,
                "additionalConditions": "\n".join(contract.terms if contract.terms else []),
            }

            files = {
                # If you're storing signature paths or bytes somewhere
                # 'farmerSignature': open(signature_path1, 'rb'),
                # 'customerSignature': open(signature_path2, 'rb'),
            }

            response = requests.post("http://localhost:6000/api/contracts/create", data=payload, files=files)

            if response.status_code != 200:
                print("PDF generation failed:", response.text)
                return None

            pdf_name = f"contract_{contract.contract_id}.pdf"
            contract_doc = models.ContractDoc(contract=contract)
            contract_doc.document.save(pdf_name, ContentFile(response.content))
            contract_doc.save()

            print("PDF saved successfully!")

            return True
        except Exception:
            print("Error approving contract:", e)
            return None
    
    async def contract_notification(self, event):
        contracts = await self.get_contracts()
        await self.send(text_data=json.dumps({"data": contracts}))