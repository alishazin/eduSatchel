
from classmenu.models import Assignment
from django.http import Http404, HttpResponse
from django.views import View
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages

import json

from edusatchel.decorators import (
    authentication_check,
    classentry_check, 
    assignmententry_check
)

class GetOnlyViewBase(View):
    @authentication_check()
    def get(self, request, *args, **kwargs):
        return self.get_only(request, *args, **kwargs)

    @authentication_check()
    def post(self, request, *args, **kwargs):
        raise Http404

class PostOnlyViewBase(View):
    @authentication_check()
    def get(self, request, *args, **kwargs):
        raise Http404

    @authentication_check()
    def post(self, request, *args, **kwargs):
        return self.post_only(request, *args, **kwargs)

class DeleteAssignmentPostOnlyView(PostOnlyViewBase):
    @classentry_check(account_type='student')
    @assignmententry_check
    def post_only(self, request, classID, assignmentID):
        assignmentObj = Assignment.objects.get(id=urlsafe_base64_decode(assignmentID).decode())
        submissionObject = assignmentObj.submission_set.filter(student=request.user)

        if submissionObject:
            submissionObject.delete()
            messages.error(request, 'Assignment submission deleted successfully')
            return HttpResponse(json.dumps({'success' : True}))

        return HttpResponse(json.dumps({'success' : False, 'element' : 'message', 'error_message' : 'Not submitted yet!'}))