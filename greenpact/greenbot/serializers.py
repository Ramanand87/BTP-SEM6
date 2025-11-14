from rest_framework import serializers


class GreenBotChatSerializer(serializers.Serializer):
    message = serializers.CharField()
    # optional: pass conversation history from frontend
    history = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )
