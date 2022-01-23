
import datetime
from datetime import timedelta

from .models import Class

DEFAULT_NUMBER_OF_DATA_IN_ONE_STEP = 3

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

def get_number_of_unseen_notification(request):
    notifications = request.user.notification_set.filter(seen=False)
    if notifications:
        length = len(notifications)
        return length if length <= 9 else '9+'
    else:
        return False

def get_notification_data_and_read_unseen(request, stepCount):
    allNotification = request.user.notification_set.all().order_by('-id')

    if stepCount == 1:
        currentStepData = get_list_for_notification_obj(allNotification[0 : DEFAULT_NUMBER_OF_DATA_IN_ONE_STEP * stepCount])
    else:
        currentStepData = get_list_for_notification_obj(allNotification[DEFAULT_NUMBER_OF_DATA_IN_ONE_STEP * (stepCount - 1) : DEFAULT_NUMBER_OF_DATA_IN_ONE_STEP * stepCount])

    returnStep = 0 if (DEFAULT_NUMBER_OF_DATA_IN_ONE_STEP * stepCount) >= len(allNotification) else stepCount + 1

    print(currentStepData) # [] no data avalilabe, usally happens when passing exceeded stepCount
    print(returnStep) # 0 (no more step)

def get_list_for_notification_obj(notification_objects):
    """ seen is set to True while taking data to frontend """
    returnList = []
    for obj in notification_objects:
        ISTdatetime = get_IST_from_UTC(obj.time)
        returnList.append([obj.header, obj.body, check_if_today_or_yesterday(ISTdatetime), [ISTdatetime.hour, ISTdatetime.minute], obj.seen])
        if obj.seen == False:
            obj.seen = True
            obj.save()
    return returnList

def get_IST_from_UTC(timedate):
    return timedate + timedelta(hours=5, minutes=30)

def check_if_today_or_yesterday(argumentDate):
    dateNow = datetime.datetime.now()
    if argumentDate.day == dateNow.day and argumentDate.month == dateNow.month and argumentDate.year == dateNow.year:
        return ['Today']
    else:
        dateYesterday = dateNow - timedelta(days = 1)
        if argumentDate.day == dateYesterday.day and argumentDate.month == dateYesterday.month and argumentDate.year == dateYesterday.year:
            return ['Yesterday']

    return [argumentDate.day, argumentDate.month, argumentDate.year]
