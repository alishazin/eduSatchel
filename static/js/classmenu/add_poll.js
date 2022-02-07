
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
                console.log( errorDivs[element])
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
        },
        validateForm : function () {
            this.errorDivController(false);

            // Title
            const titleValue = this.titleField.value.trim();
            if (titleValue.length <= 5) {
                this.errorDivController('title', 'Title length should be greater than 5 characters')
            }
            
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
            }
        },
        addCallbacks : function () {
            const allFields = [this.titleField, this.optionOne, this.optionTwo, this.optionThree, this.optionFour, this.optionFive];
            this.submitButton.onclick = () => {
                this.validateForm();
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