
var pollFormObject = {};

function onLoad() {
    navBarObj.selectItem(3);

    pollFormObject = {
        titleField : document.querySelector('.content-box > .title-box > textarea'),
        optionOne : document.querySelector(".content-box > .option-box > input[name='option-1']"),
        optionTwo : document.querySelector(".content-box > .option-box > input[name='option-2']"),
        optionThree : document.querySelector(".content-box > .option-box > input[name='option-3']"),
        optionFour : document.querySelector(".content-box > .option-box > input[name='option-4']"),
        optionFive : document.querySelector(".content-box > .option-box > input[name='option-5']"),
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
        errorDivController : function (element, message) {
            const errorDivs = {
                title : document.querySelector('.content-box > .title-box > .error-div'),
                option : document.querySelector('.content-box > .option-box > .error-div'),
            }
            if (element === false) {
                for (let x in errorDivs) {
                    errorDivs[x].style.display = 'none';
                    errorDivs[x].innerText = ''
                }
            } else {
                errorDivs[element].style.display = 'block';
                errorDivs[element].innerText = message;
            }
        },
        resetAll : function () {
            this.titleField.value = '';
            this.optionOne.value = '';
            this.optionTwo.value = '';
            this.optionThree.value = '';
            this.optionFour.value = '';
            this.optionFive.value = '';

            const allFields = [this.titleField, this.optionOne, this.optionTwo, this.optionThree, this.optionFour, this.optionFive];
            allFields.forEach(field => {
                field.className = '';
            })
        },
        validateForm : function () {
            this.errorDivController(false);

            // Title
            const titleValue = this.titleField.value.trim();
            if (titleValue.length <= 5) {
                this.errorDivController('title', 'Title length should be greater than 5 characters')
            } else {
                // Options
                const optionOneValue = this.optionOne.value.trim();
                const optionTwoValue = this.optionTwo.value.trim();
                const optionThreeValue = this.optionThree.value.trim();
                const optionFourValue = this.optionFour.value.trim();
                const optionFiveValue = this.optionFive.value.trim();
                
                let boolArray = [];
                [optionOneValue, optionTwoValue, optionThreeValue, optionFourValue, optionFiveValue].forEach(option => {if (option) { boolArray.push(true); }});
    
                if (boolArray.length < 2) {
                    this.errorDivController('option', 'Atlest two options are required')
                } else { this.asyncFuncForPoll() }
            }
            
        },
        asyncFuncForPoll : async function () {
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
        getFormData : function () {
            const formdata = new FormData();
            formdata.append('title', this.titleField.value.trim());
            formdata.append('option-1', this.optionOne.value.trim());
            formdata.append('option-2', this.optionTwo.value.trim());
            formdata.append('option-3', this.optionThree.value.trim());
            formdata.append('option-4', this.optionFour.value.trim());
            formdata.append('option-5', this.optionFive.value.trim());

            return formdata;
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
                
                req.open('POST', `/class/${classIDGlobal}/polls/add-poll/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(this.getFormData());
            })
        },
        addCallbacks : function () {
            const allFields = [this.titleField, this.optionOne, this.optionTwo, this.optionThree, this.optionFour, this.optionFive];
            this.submitButton.onclick = () => {
                if (this.loadingState === false) {
                    this.validateForm();
                }
            }

            allFields.forEach(field => {
                field.oninput = () => {
                    if (field.value.trim()) { field.className = 'inputted'; } 
                    else { field.className = ''; }
                }
            })
        }
    }
    pollFormObject.addCallbacks();
}