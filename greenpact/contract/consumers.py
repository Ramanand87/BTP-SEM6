from channels.generic.websocket import AsyncWebsocketConsumer
from user.models import CustomUser
from rest_framework_simplejwt.tokens import AccessToken
from . import models,serializers
import json
from asgiref.sync import sync_to_async

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
                    await self.send(text_data=json.dumps({"contracts": len(contracts)}))
                elif action=="approve_contracts":
                    if self.user.type=="farmer":
                        await self.approve_contract(data)
                        contracts = await self.get_contracts()
                        await self.send(text_data=json.dumps({"contracts": contracts}))
                    else:
                        self.send(text_data=json.dumps({"error":"You cant approve this contract wait for seller to approve"}))
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
    def approve_contracts(self, data):
        try:
            contract=models.Contract.objects.get(contract_id=data["contract_id"])
            contract.approved=True
            contract.save()
        except Exception:
            return None
    
    async def contract_notification(self, event):
        contracts = await self.get_contracts()
        await self.send(text_data=json.dumps({"contracts": len(contracts)}))