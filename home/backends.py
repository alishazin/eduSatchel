
from .models import Class

def validate_new_class(request):
    data = request.POST

    returnDict = {
        'title_error' : '',
        'description_error' : '',
        'general_error' : '',
    }

    if 'title' in data.keys() and 'description' in data.keys():
        title = data['title'].strip()
        description = data['description'].strip()

        if len(title) > 80 or len(title) < 5: 
            returnDict['title_error'] = 'Title should be between 5 and 80 in length'
            return returnDict

        if request.user.class_set.filter(title__iexact=title): # __iexact for case-insensitive search
            returnDict['title_error'] = 'You have created a class with the same title'
            return returnDict

        if len(description) > 300 or len(description) < 5: 
            returnDict['description_error'] = 'Description should be between 5 and 300 in length'
            return returnDict

        return True
    else:
        returnDict['general_error'] = 'Something went wrong. Refresh the page ?'
        return returnDict

def validate_join_class(request):
    data = request.POST

    returnDict = {
        'class_id_error' : '',
        'general_error' : '',
    }

    if 'class_id' in data.keys():
        id = data['class_id'].strip()
        try:
            class_obj = Class.objects.filter(id=id)[0]
        except:
            class_obj = None
        
        if class_obj == None:
            returnDict['class_id_error'] = 'Invalid Class ID'
            return [False, returnDict]

        if class_obj.active == False:
            returnDict['class_id_error'] = 'Teacher of this class does not allow anymore students'
            return [False, returnDict]

        try:
            classEnrollmentObj = request.user.classenrollment_set.filter(class_obj=class_obj)[0]
        except:
            classEnrollmentObj = None

        if classEnrollmentObj:
            if classEnrollmentObj.enrolled:
                returnDict['class_id_error'] = 'You have already enrolled in this class'
            else:
                returnDict['class_id_error'] = 'Your have already send a join request'
            return [False, returnDict]

        return [True, class_obj]
    else:
        returnDict['general_error'] = 'Something went wrong. Refresh the page ?'
        return [False, returnDict]