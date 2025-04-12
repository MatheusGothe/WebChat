from django.contrib import admin

# Register your models here.
from attachments.models import FileAttachment,AudioAtachment

admin.site.register(FileAttachment)
admin.site.register(AudioAtachment) 