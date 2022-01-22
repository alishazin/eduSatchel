from django.contrib import admin
from .models import Class, ClassEnrollment

# Register your models here.

class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'teacher', 'title', 'date_started', 'active') 
    readonly_fields = ('id', 'date_started')

class ClassEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('class_obj', 'student') 


admin.site.register(Class, ClassAdmin)
admin.site.register(ClassEnrollment, ClassEnrollmentAdmin)