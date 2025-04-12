from django.contrib import admin

# Register your models here.
from chats.models import Chat,ChatMessage

admin.site.register(Chat)
admin.site.register(ChatMessage)

