
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