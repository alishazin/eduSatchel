from django.contrib import admin
from .models import File, MessagePublic

# Register your models here.

class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'location_hint', 'class_obj') 
    readonly_fields = ('id',)

class MessagePublicAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'class_obj', 'user') 
    readonly_fields = ('id',)

admin.site.register(File, FileAdmin)
admin.site.register(MessagePublic, MessagePublicAdmin)