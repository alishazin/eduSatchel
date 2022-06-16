
Number.prototype.countDecimals = function () {
    try {
        if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
        return this.toString().split(".")[1].length || 0; 
    } catch(err) {
        return 3;
    }
}

var buttonObject = {};

var addReviewObject = {};

function onLoad() {
    navBarObj.selectItem(1);

    buttonObject = {
        self : document.querySelector('.content-parent button'),
        spinner : document.querySelector('.content-parent button > .spinner'),
        text : document.querySelector('.content-parent button > .span'),
        _state : 'normal',
        get state () {
            return this._state;
        },
        set state(arg) {
            if (arg === 'loading') {
                this.self.classList = 'loading'
            } else if (arg === 'normal') {
                this.self.classList = ''
            }
            this._state = arg;
        }
    };

    addReviewObject = {
        messageField : document.querySelector('.content-parent > .correct-submission > textarea'),
        markField : document.querySelector('.content-parent > .correct-submission > input[type="number"]'), 
        errorDiv : document.querySelector('.content-parent > .correct-submission > .error-div'),
        getFormData : function () {
            const formdata = new FormData()
            formdata.append('message', this.messageField.value.trim())
            formdata.append('marks', this.markField.value.trim())
            return formdata;
        },
        asyncFuncForCorrection : async function () {
            try {
                if (this.validateForm()) {
                    this.errorDiv.innerText = ''
                    buttonObject.state = 'loading'
                    await this.sendPostRequestForCorrection()
                    buttonObject.state = 'normal'
                    location.href = location.href;
                }
            } catch(errorObj) {
                if (errorObj.type === 'backend') {
                    this.errorDiv.innerText = errorObj.error_message
                } else if (errorObj.type === 'network') {
                    errorObj.call();
                }
            }
        },
        sendPostRequestForCorrection : function () {
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
                
                req.open('POST', `/assignment/${classIDGlobal}/${assignmentID}/correct/${submissionID}/add-correction/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(this.getFormData());
            })
        },
        validateForm : function () {
            // Message is optional

            const numberGivenMark = Number(this.markField.value);
                    
            if (numberGivenMark <= 0) {
                this.errorDiv.innerText = 'Invalid Total Marks';
            } else if (numberGivenMark > totalMarkFromBackend) {
                this.errorDiv.innerText = 'Invalid Total Marks';
            } else if (numberGivenMark.countDecimals() > 2) {
                this.errorDiv.innerText = 'Invalid Total Marks';
            } else {
                return true;
            }
        },
        addCallbacks : function () {
            [this.messageField, this.markField].forEach(field => {
                field.oninput = () => {
                    if (field.value.trim()) { field.className = 'inputted'; } 
                    else { field.className = ''; }
                }
            })

            buttonObject.self.onclick = () => {
                if (buttonObject.state === 'normal') {
                    this.asyncFuncForCorrection();
                }
            }
        }
    };

    
    if (isSubmissionCorrected === 'True') {
        
    } else {
        addReviewObject.addCallbacks();
    }
}

// send notification if corrected to student
// Correction details in submission page for students