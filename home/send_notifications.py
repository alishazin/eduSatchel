
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
    body = f"You have recieved a Join Request for the class '{classObj.title}' from '{userObj.username}'\n\nYou can accept or reject the request from the class menu"
    classObj.teacher.notification_set.create(
        header="Join Request Recieved",
        body=body
    )