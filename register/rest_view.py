
from django.views import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import CustomUser
from edusatchel.settings import ADMIN_ACCES_CODE

@method_decorator(csrf_exempt, name='dispatch')
class CreateTeacherAccountView(View):

    def post(self, request):
        if "HTTP_ADMIN_ACCESS_CODE" in request.META and request.META["HTTP_ADMIN_ACCESS_CODE"] == ADMIN_ACCES_CODE:
            user_obj = CustomUser.objects.create_user(
                portal_id = request.POST['portal_id'],
                email = request.POST['email'],
                username = request.POST['username'],
                password = request.POST['password'],
                account_type = 'teacher'
            )
            user_obj.profile_pic = request.POST['profile_pic']
            user_obj.save()
            return HttpResponse("ok")
        
        return HttpResponse("not ok")

@method_decorator(csrf_exempt, name='dispatch')
class CreateStudentAccountView(View):

    def post(self, request):
        if "HTTP_ADMIN_ACCESS_CODE" in request.META and request.META["HTTP_ADMIN_ACCESS_CODE"] == ADMIN_ACCES_CODE:
            user_obj = CustomUser.objects.create_user(
                portal_id = request.POST['portal_id'],
                email = request.POST['email'],
                username = request.POST['username'],
                password = request.POST['password'],
                account_type = 'student'
            )
            user_obj.profile_pic = request.POST['profile_pic']
            user_obj.save()
            return HttpResponse("ok")
        
        return HttpResponse("not ok")

@method_decorator(csrf_exempt, name='dispatch')
class DeleteAccountView(View):

    def post(self, request):
        if "HTTP_ADMIN_ACCESS_CODE" in request.META and request.META["HTTP_ADMIN_ACCESS_CODE"] == ADMIN_ACCES_CODE:
            data = request.POST
            obj = CustomUser.objects.get(portal_id=data['portal_id'])
            obj.delete()
            return HttpResponse("ok")
        
        return HttpResponse("not ok")