
from django.views import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import CustomUser
from edusatchel.settings import ADMIN_ACCES_CODE
from .models import Class, ClassEnrollment
import json
from django.core.serializers.json import DjangoJSONEncoder

@method_decorator(csrf_exempt, name='dispatch')
class CreateNewClassView(View):

    def post(self, request):
        if "HTTP_ADMIN_ACCESS_CODE" in request.META and request.META["HTTP_ADMIN_ACCESS_CODE"] == ADMIN_ACCES_CODE:
            data = dict(request.POST)
            returnValues = []
            for count in range(len(data['teacher_portal_ids'])):
                obj = Class.objects.create(
                    teacher=CustomUser.objects.get(portal_id=int(data['teacher_portal_ids'][count])),
                    title=data['titles'][count],
                    description=data['descriptions'][count],
                )
                returnValues.append(obj.id)
                
            return HttpResponse(json.dumps(returnValues, cls=DjangoJSONEncoder))
        
        return HttpResponse("not ok")

@method_decorator(csrf_exempt, name='dispatch')
class JoinNewClassView(View):

    def post(self, request):
        if "HTTP_ADMIN_ACCESS_CODE" in request.META and request.META["HTTP_ADMIN_ACCESS_CODE"] == ADMIN_ACCES_CODE:
            data = dict(request.POST)
            class_objs = json.loads(data['class_objs'][0])
            student_obj = CustomUser.objects.get(portal_id=data['student'][0])
            
            for class_id in class_objs:
                ClassEnrollment.objects.create(
                    class_obj=Class.objects.get(id=class_id),
                    student=student_obj
                )
                
            return HttpResponse("ok")
        
        return HttpResponse("not ok")