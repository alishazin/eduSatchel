from django.contrib import admin
from .models import File, MessagePublic, Url

# Register your models here.

class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'location_hint', 'class_obj') 
    readonly_fields = ('id',)

class MessagePublicAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'class_obj', 'user', 'date') 
    readonly_fields = ('id', 'date')

class UrlAdmin(admin.ModelAdmin):
    list_display = ('id', 'url') 
    readonly_fields = ('id',)

admin.site.register(File, FileAdmin)
admin.site.register(MessagePublic, MessagePublicAdmin)
admin.site.register(Url, UrlAdmin)