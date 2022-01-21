from django.contrib import admin
from .models import Class

# Register your models here.

class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'teacher', 'title', 'date_started', 'state') 
    readonly_fields = ('id', 'date_started')

admin.site.register(Class, ClassAdmin)