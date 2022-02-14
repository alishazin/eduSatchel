from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from edusatchel.decorators import classentry_check

# Create your views here.

class SubmitAssignmentView(View):
    def get(self, request, assignmentID):
        print(assignmentID)
        return HttpResponse('Submit')

class CorrectAssignmentView(View):
    def get(self, request, assignmentID):
        print(assignmentID)
        return HttpResponse('Correct')