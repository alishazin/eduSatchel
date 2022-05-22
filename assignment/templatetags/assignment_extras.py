
from django import template

# Custom filters
register = template.Library()

def is_assignment_submitted_filter(assignmentObj, userObj):
    if len(assignmentObj.submission_set.filter(student=userObj)) == 0:
        return False
    return True

def check_submitted_files(assignmentObj, userObj):
    return len(assignmentObj.submission_set.get(student=userObj).files.all())

def get_submitted_files(assignmentObj, userObj):
    return assignmentObj.submission_set.get(student=userObj).files.all()

def check_submitted_urls(assignmentObj, userObj):
    return len(assignmentObj.submission_set.get(student=userObj).urls.all())

def get_submitted_urls(assignmentObj, userObj):
    return assignmentObj.submission_set.get(student=userObj).urls.all()

register.filter('is_assignment_submitted_filter', is_assignment_submitted_filter)
register.filter('check_submitted_files', check_submitted_files)
register.filter('get_submitted_files', get_submitted_files)
register.filter('check_submitted_urls', check_submitted_urls)
register.filter('get_submitted_urls', get_submitted_urls)