
from django.core.validators import URLValidator
from .models import (
    File,
    Url,
)

from datetime import timedelta

def validate_urls_files(postData, formFiles):

    validator = URLValidator()
    urlCount = 0
    while True:
        urlCount += 1
        check_url = f'url-{urlCount}'
        if check_url in postData.keys():
            try:
                validator(postData[check_url])
            except:
                return 'Invalid URl'
        else:
            break

    fileCount = 0
    while True:
        fileCount += 1
        check_file = f'file-{fileCount}'
        if check_file in formFiles.keys():
            format = get_file_format_validate_length(formFiles[check_file]._name)
            if format == False:
                return 'Invalid File Format'
        else:
            break

    return True


def get_file_format_validate_length(filename):
    format = filename.split('.')[-1]
    if len(format) <= 100:
        return format
    else: 
        return False

def insert_url_and_file_values(postData, fileData, classObj, location_hint):
    
    addedUrls = []
    urlCount = 0

    while True:
        urlCount += 1
        check_url = f'url-{urlCount}'
        if check_url in postData.keys():
            addedUrls.append(Url.objects.create(url=postData[check_url]))
        else:
            break

    addedFiles = []
    fileCount = 0

    while True:
        fileCount += 1
        check_file = f'file-{fileCount}'
        if check_file in fileData.keys():
            addedFiles.append(File.objects.create(
                file = fileData[check_file],
                format = get_file_format_validate_length(fileData[check_file]._name),
                location_hint = location_hint,
                class_obj = classObj,
            ))
        else:
            break

    return [addedUrls, addedFiles]

def convert_IST_to_UTC(ISTDateTime):
    return ISTDateTime - timedelta(hours=5, minutes=30)

def addDateStamps(ObjList):
    newList = []
    latestDate = None
    for obj in ObjList:
        currDate = obj.formatted_date_added
        if currDate != latestDate and currDate != 'Today':
            newList.append(obj.formatted_date_added)
            latestDate = currDate
        newList.append(obj)

    return newList

def removeStudent(studentObj, classObj):
    # checking if student
    if studentObj.isTeacher:
        return False
    
    # deleting all submissions (correction deleted by cascade)
    for i in studentObj.submission_set.all():
        i.delete()

    # deleting all messages
    for i in studentObj.messagepublic_set.all():
        i.delete()

    studentObj.classenrollment_set.filter(class_obj=classObj)[0].delete()
    return True