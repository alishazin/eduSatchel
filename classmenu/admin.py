from django.contrib import admin
from .models import File, MessagePublic, Url, Assignment, Poll, PolledDetail, PollOption

# Register your models here.

class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'location_hint', 'class_obj') 
    readonly_fields = ('id',)

class MessagePublicAdmin(admin.ModelAdmin):
    list_display = ('id', 'content', 'class_obj', 'user', 'date_added') 
    readonly_fields = ('id', 'date_added')

class UrlAdmin(admin.ModelAdmin):
    list_display = ('id', 'url') 
    readonly_fields = ('id',)

class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'class_obj', 'date_added', 'date_due') 
    readonly_fields = ('id', 'date_added', 'date_due')

class PollAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'class_obj', 'closed') 
    readonly_fields = ('id', 'date_added')

class PollOptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'poll_obj', 'content') 
    readonly_fields = ('id',)

class PolledDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'poll_option_obj', 'student', 'date_added') 
    readonly_fields = ('id', 'date_added',)

admin.site.register(PolledDetail, PolledDetailAdmin)
admin.site.register(PollOption, PollOptionAdmin)
admin.site.register(Poll, PollAdmin)
admin.site.register(File, FileAdmin)
admin.site.register(MessagePublic, MessagePublicAdmin)
admin.site.register(Url, UrlAdmin)
admin.site.register(Assignment, AssignmentAdmin)