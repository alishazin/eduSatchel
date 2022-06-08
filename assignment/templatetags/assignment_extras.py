
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

def check_submission_message(assignmentObj, userObj):
    if assignmentObj.submission_set.get(student=userObj).message is None:
        return False
    return True

def get_submission_message(assignmentObj, userObj):
    return assignmentObj.submission_set.get(student=userObj).message

register.filter('is_assignment_submitted_filter', is_assignment_submitted_filter)
register.filter('check_submitted_files', check_submitted_files)
register.filter('get_submitted_files', get_submitted_files)
register.filter('check_submitted_urls', check_submitted_urls)
register.filter('get_submitted_urls', get_submitted_urls)
register.filter('check_submission_message', check_submission_message)
register.filter('get_submission_message', get_submission_message)