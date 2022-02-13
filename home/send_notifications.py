
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

def after_adding_asignment(classObj, assignmentObj):
    body = f"A New Assignment is added in '{classObj.title}'.\n\nAssignment will be due on '{assignmentObj.formatted_date_due} {assignmentObj.date_due_time_only}'."
    for enrollmentObj in classObj.get_enrolled_students():
        enrollmentObj.student.notification_set.create(
            header="New Assignment Added",
            body=body
        )

def after_adding_poll(classObj, pollObj):
    body = f"A New Poll is added in '{classObj.title}'.\n\nPoll Topic : {pollObj.title}"
    for enrollmentObj in classObj.get_enrolled_students():
        enrollmentObj.student.notification_set.create(
            header="New Poll Added",
            body=body
        )

def after_closing_poll(classObj, pollObj):
    body = f"The Poll regarding the topic '{pollObj.title}' in '{classObj.title}' is closed.\n\nThis means that no more students would be able to cast their vote.\n\nYou can see the result of the poll in class page"
    for enrollmentObj in classObj.get_enrolled_students():
        enrollmentObj.student.notification_set.create(
            header="Poll Closed",
            body=body
        )