from django.contrib import admin
from .models import Submission

# Register your models here.

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'assignment_obj', 'student', 'date_added') 
    readonly_fields = ('id', 'date_added',)

admin.site.register(Submission, SubmissionAdmin)