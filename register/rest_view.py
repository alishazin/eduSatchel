
from django.views import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import CustomUser

@method_decorator(csrf_exempt, name='dispatch')
class CreateTeacherAccountView(View):

    def post(self, request):
        user_obj = CustomUser.objects.create_user(
            portal_id = request.POST['portal_id'],
            email = request.POST['email'],
            username = request.POST['username'],
            password = request.POST['password'],
            account_type = 'teacher'
        )
        user_obj.profile_pic = request.POST['profile_pic']
        user_obj.save()
        return HttpResponse("sadasd")

@method_decorator(csrf_exempt, name='dispatch')
class CreateStudentAccountView(View):

    def post(self, request):
        user_obj = CustomUser.objects.create_user(
            portal_id = request.POST['portal_id'],
            email = request.POST['email'],
            username = request.POST['username'],
            password = request.POST['password'],
            account_type = 'student'
        )
        user_obj.profile_pic = request.POST['profile_pic']
        user_obj.save()
        return HttpResponse("sadasd")