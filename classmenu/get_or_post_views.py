
from django.http import Http404, HttpResponse
from django.views import View
from django.shortcuts import redirect, render

from edusatchel.decorators import authentication_check, classentry_check

import json

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

class SendPublicMessagePostOnlyView(PostOnlyViewBase):
    @classentry_check()
    def post_only(self, request, classID):
        print(classID)
        print(request.POST)
        print(request.FILES)
        print(request.user)
        return HttpResponse("Success")