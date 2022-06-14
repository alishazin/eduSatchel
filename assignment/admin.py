from django.contrib import admin
from .models import Submission, Correction

# Register your models here.

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'assignment_obj', 'student', 'date_added') 
    readonly_fields = ('id', 'date_added',)

class CorrectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'submission_obj', 'message', 'date_added', 'given_marks') 
    readonly_fields = ('id', 'date_added',)

admin.site.register(Submission, SubmissionAdmin)
admin.site.register(Correction, CorrectionAdmin)