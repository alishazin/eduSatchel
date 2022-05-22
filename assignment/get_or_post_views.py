
from django.http import Http404, HttpResponse
from django.views import View

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
        print(21312321)
        return HttpResponse('asdas')