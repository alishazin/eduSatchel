
def after_creating_class(userObj, classObj):
    if classObj.active:
        body = f"New Class '{classObj.title}' Created Successfully.\n\nClass ID : {classObj.id}\n\nYou can now share the class ID with the students, so they can send join request.\n\nYou will be notified if any join request is recieved."
    else:
        body = f"New Class '{classObj.title}' Created Successfully.\n\nClass ID : {classObj.id}\n\nYou have blocked all the join request. By unblocking it You can share the class ID with the students, so they can send join request.\n\nYou will be notified if any join request is recieved."
    
    userObj.notification_set.create(
        header="New Class Created",
        body=body
    )

def after_joining_class(userObj, classObj):
    body = f"You have recieved a Join Request for the class '{classObj.title}' from '{userObj.username}'\n\nYou can accept or reject the request from the class settings"
    classObj.teacher.notification_set.create(
        header="Join Request Recieved",
        body=body
    )

def after_declining_join_request(studentObj, classObj):
    body = f"We are sorry to let you know that your Join Request for the class '{classObj.title}' has been declined.\n\nYou can send Join Request again if you want."
    studentObj.notification_set.create(
        header="Join Request Declined",
        body=body
    )

def after_accepting_join_request(studentObj, classObj):
    body = f"Your Join Request for the class '{classObj.title}' has been accepted.\n\nYou can now enter the class from the home page."
    studentObj.notification_set.create(
        header="Join Request Accepted",
        body=body
    )