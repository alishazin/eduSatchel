
var formObject = {}

function onLoad() {
    navBarObj.selectItem(1);

    initializeFormObject();

    return document.querySelector('.content-box > .error-div');
}

function initializeFormObject() {
    formObject = {
        messageField : document.querySelector('.content-box > textarea'),
        submitButton : document.querySelector('.content-box > button'),
        _loadingState : false,
        get loadingState() {
            return this._loadingState;
        },
        set loadingState(arg) {
            if (arg === true) {
                this.submitButton.className = 'loading';
            } else if (arg === false) {
                this.submitButton.className = '';
            }
            this._loadingState = arg;
        },
        errorDivController : function (field, errorText) {
            const allFields = {
                attach : document.querySelector('.error-div.attach-file-error-div'),
                message : document.querySelector('.error-div.message-error-div'),
            }
            if (field === false) {
                for (let x in allFields) {
                    allFields[x].innerText = '';
                    allFields[x].style.display = 'none';
                }
            } else if (errorText === false) {
                allFields[field].innerText = '';
                allFields[field].style.display = 'none';
            } else {
                allFields[field].style.display = 'block';
                allFields[field].innerText = errorText;
            }
        },
        validateForm : function () {
            this.errorDivController(false);

            const messageValue = this.messageField.value.trim()
            const attachData = attachFileBlockObj.getData()
            if (attachData['files'][1]) {
                this.asyncFuncForAssignment()
            } else if (attachData['urls'][1]) {
                this.asyncFuncForAssignment()
            } else if (messageValue) {
                this.asyncFuncForAssignment()
            } else {
                this.errorDivController("message", 'No content to submit')
            }
            
        },
        asyncFuncForAssignment : async function () {
            try {
                this.loadingState = true;
                await this.sendPostRequestForAssignment();
                this.loadingState = false;
                this.resetAll();
                location.href = classHomeURL;
            } catch(errorObj) {
                if (errorObj['type'] === 'network') {
                    errorObj.call();
                } else if (errorObj['type'] === 'backend' && errorObj['element'] === 'alert') {
                    alert(errorObj['error_message'])
                } else {
                    this.errorDivController(errorObj['element'], errorObj['error_message'])
                }
                this.loadingState = false;
            }
        },
        sendPostRequestForAssignment : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        console.log(response)
                        if (response['success'] === true) {
                            resolve();
                        } else {
                            response.type = 'backend';
                            reject(response)
                        }
                    }
                }

                req.onerror = () => {
                    reject({
                        type : 'network',
                        call : () => {
                            alert("No Active Network Connection")
                        }
                    });
                }
                
                req.open('POST', `/assignment/${classIDGlobal}/${assignmentID}/submit/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(this.getFormData());
            })
        },
        getFormData : function () {
            let fileCountLocal = 0;
            let urlCountLocal = 0;
            fileAndUrlData = attachFileBlockObj.getData() 

            const formdata = new FormData();
            formdata.append('message', this.messageField.value.trim());
            
            for (let x in fileAndUrlData.files) {
                fileCountLocal++;
                formdata.append(`file-${fileCountLocal}`, fileAndUrlData.files[x]);
            }
            
            for (let x in fileAndUrlData.urls) {
                urlCountLocal++;
                formdata.append(`url-${urlCountLocal}`, fileAndUrlData.urls[x]);
            }

            return formdata;
        },
        resetAll : function () {
            this.messageField.value = '';
            attachFileBlockObj.resetAll();
        },
        addCallbacks : function () {
            this.messageField.oninput = () => {
                if (this.messageField.value.trim()) { this.messageField.className = 'inputted'; } 
                else { this.messageField.className = ''; }
            }
            this.submitButton.onclick = () => {
                if (this.loadingState === false) {
                    this.validateForm();
                }
            }
        },
        addCallbacksAfterSubmission : function () {
            this.submitButton.onclick = () => {
                if (this.loadingState === false) {
                    if (confirm('Are you sure about deleting ?')) {
                        this.asyncFuncforDeleting();
                    }
                }
            }
        },
        asyncFuncforDeleting : async function () {
            try {
                this.loadingState = true;
                await this.sendPostRequestForDeleting();
                this.loadingState = false;
                location.href = classHomeURL;
            } catch(errorObj) {
                if (errorObj['type'] === 'network') {
                    errorObj.call();
                } else if (errorObj['type'] === 'backend' && errorObj['element'] === 'alert') {
                    alert(errorObj['error_message'])
                } else {
                    this.errorDivController(errorObj['element'], errorObj['error_message'])
                }
                this.loadingState = false;
            }
        },
        sendPostRequestForDeleting : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        console.log(response)
                        if (response['success'] === true) {
                            resolve();
                        } else {
                            response.type = 'backend';
                            reject(response)
                        }
                    }
                }

                req.onerror = () => {
                    reject({
                        type : 'network',
                        call : () => {
                            alert("No Active Network Connection")
                        }
                    });
                }
                
                console.log(`/assignment/${classIDGlobal}/${assignmentID}/delete/`);
                req.open('POST', `/assignment/${classIDGlobal}/${assignmentID}/delete/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send();
            })
        }
    }
    try {
        formObject.addCallbacks()
    } catch(err) {
        formObject.addCallbacksAfterSubmission()
    }

}

function downloadFile(uri) {
    var link = document.createElement("a");
    link.href = uri;
    link.click();
}

function copyText(url) {
    navigator.clipboard.writeText(url)
}