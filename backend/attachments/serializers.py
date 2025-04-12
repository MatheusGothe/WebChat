from rest_framework import serializers

from attachments.models import FileAttachment,AudioAtachment
from attachments.utils.formatter import formatter 

from django.conf import settings

class FileAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileAttachment
        fields = '__all__'
    
    def to_representation(self,instace):
        data = super().to_representation(instace)
        data['size'] = formatter.format_bytes(instace.size)
        data['src'] = f"{settings.CURRENT_URL}{instace.src}"

        return data
    

class AudioAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioAtachment
        fields = '__all__'
    
    def to_representation(self,instace):
        data = super().to_representation(instace)
        data['src'] = f"{settings.CURRENT_URL}{instace.src}"

        return data
    