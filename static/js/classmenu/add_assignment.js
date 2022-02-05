
var formObject = {};

Number.prototype.countDecimals = function () {
    try {
        if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
        return this.toString().split(".")[1].length || 0; 
    } catch(err) {
        return 3;
    }
}

function onLoad() {
    navBarObj.selectItem(2);

    initializeFormObject();

    return document.querySelector('.content-box > .error-div');
}

function inputPlaceHolderConstructor(input, label) {
    input.oninput = () => {
        if (input.value.length > 0) {
            label.style.opacity = '0';
        } else {
            label.style.opacity = '1';
        }
    }
}

function addZeroToLeftTime(string) {
    if (String(string).length === 1) {
        return `0${string}`;
    }
    return string;
}

function initializeFormObject() {
    formObject = {
        contentField : document.querySelector('.content-box > textarea'),
        dateTimeField : document.querySelector(".content-box > .datetime-container > input[type='datetime-local']"),
        totalMarksField : document.querySelector(".content-box > input[type='number']"),
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
                content : document.querySelector('.error-div.content-error-div'),
                attach : document.querySelector('.error-div.attach-file-error-div'),
                dueDate : document.querySelector('.error-div.date-error-div'),
                totalMarks : document.querySelector('.error-div.marks-error-div'),
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
            // Content
            const contentValue = this.contentField.value.trim();
            // if (contentValue.length <= 5 ) {
            if (contentValue.length <= 1 ) {
                this.errorDivController('content', 'Content length should be greater than 5')
            } else {
                const dateTimeNow = new Date();
                const dueDateInObj = new Date(this.dateTimeField.value);
                
                if (dueDateInObj == 'Invalid Date') {
                    this.errorDivController('dueDate', 'Due date is a required field');
                } else if (dueDateInObj.getTime() <= dateTimeNow.getTime()) {
                    this.errorDivController('dueDate', 'Due date and time should be greater than the current datetime');
                } else {
                    const numberTotalMark = Number(this.totalMarksField.value);
                    
                    if (numberTotalMark) {
                        if (numberTotalMark > 1000) {
                            this.errorDivController('totalMarks', 'Invalid Total Marks');
                        } else if (numberTotalMark.countDecimals() > 2) {
                            this.errorDivController('totalMarks', 'Invalid Total Marks');
                        } else {
                            this.asyncFuncForAssignment();
                        }
                    }
                }
            }
            
        },
        getFormData : function () {
            let fileCountLocal = 0;
            let urlCountLocal = 0;
            fileAndUrlData = attachFileBlockObj.getData() 

            const formdata = new FormData();
            formdata.append('content', this.contentField.value.trim());
            
            for (let x in fileAndUrlData.files) {
                fileCountLocal++;
                formdata.append(`file-${fileCountLocal}`, fileAndUrlData.files[x]);
            }
            
            for (let x in fileAndUrlData.urls) {
                urlCountLocal++;
                formdata.append(`url-${urlCountLocal}`, fileAndUrlData.urls[x]);
            }
            
            const dateTimeFieldObj = new Date(this.dateTimeField.value);
            formdata.append('due-date', `${dateTimeFieldObj.getFullYear()}-${addZeroToLeftTime(dateTimeFieldObj.getMonth() + 1)}-${addZeroToLeftTime(dateTimeFieldObj.getDate())} ${addZeroToLeftTime(dateTimeFieldObj.getHours())}:${addZeroToLeftTime(dateTimeFieldObj.getMinutes())}`);
            formdata.append('total-marks', Number(this.totalMarksField.value));

            return formdata;
        },
        asyncFuncForAssignment : async function () {
            try {
                this.loadingState = true;
                await this.sendPostRequestForAssignment();
                this.loadingState = false;
            } catch(errorObj) {
                if (errorObj['type'] === 'network') {
                    errorObj.call();
                } else if (errorObj['type'] === 'backend' && errorObj['element'] === 'alert') {
                    alert(errorObj['error_message'])
                } else {
                    this.errorDivController(errorObj['element'], errorObj['error_message'])
                }
                this.loadingState = false;
                console.log(errorObj)
            }
        },
        sendPostRequestForAssignment : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
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
                
                req.open('POST', `/class/${classIDGlobal}/add-assignment/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(this.getFormData());
            })
        },
        addCallbacks : function () {
            setInterval((() => {
                const dateTimeToday = new Date();
                this.dateTimeField.min = `${dateTimeToday.getFullYear()}-${addZeroToLeftTime(dateTimeToday.getMonth() + 1)}-${addZeroToLeftTime(dateTimeToday.getDate())}T${addZeroToLeftTime(dateTimeToday.getHours())}:${addZeroToLeftTime(dateTimeToday.getMinutes())}`;
            })(), 60 * 1000);

            this.submitButton.onclick = () => {
                this.validateForm();
            }
        }
    }
    formObject.addCallbacks();
}