from django.contrib import admin
from .models import Class, ClassEnrollment, Notification

# Register your models here.

class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'teacher', 'title', 'date_started', 'active') 
    readonly_fields = ('id', 'date_started')

class ClassEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('class_obj', 'student', 'enrolled') 
    readonly_fields = ('id',)

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'header', 'time', 'seen') 
    readonly_fields = ('id', 'time')


admin.site.register(Class, ClassAdmin)
admin.site.register(ClassEnrollment, ClassEnrollmentAdmin)
admin.site.register(Notification, NotificationAdmin)