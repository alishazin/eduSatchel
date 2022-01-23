
from django.http import Http404, HttpResponse
from django.views import View

from edusatchel.decorators import authentication_check

class GetOnlyViewBase(View):
    @authentication_check()
    def get(self, request, *args, **kwargs):
        return self.get_only(request, *args, **kwargs)

    @authentication_check()
    def post(self, request, *args, **kwargs):
        raise Http404

class NotificationGetOnlyView(GetOnlyViewBase):
    def get_only(self, request, stepCount):
        return HttpResponse(stepCount)