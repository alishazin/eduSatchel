from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check, assignmententry_check

# Create your views here.

class SubmitAssignmentView(View):
    @classentry_check(account_type='student')
    @assignmententry_check
    def get(self, request, classID, assignmentID):
        print(assignmentID)
        return HttpResponse('Submit')

class CorrectAssignmentView(View):
    @classentry_check(account_type='teacher')
    @assignmententry_check
    def get(self, request, classID, assignmentID):
        print(assignmentID)
        return HttpResponse('Correct')