
from django.core.validators import URLValidator
from .models import (
    File,
    Url,
    MessagePublic
)

def validate_urls_files(postData, formFiles):

    status = 'OK'
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
    # Addimg Url
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