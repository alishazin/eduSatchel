
var formObject = {}

function onLoad() {
    navBarObj.selectItem(1);

    initializeFormObject();

    return document.querySelector('.content-box > .error-div');
}

function initializeFormObject() {
    formObject = {
        messageField : document.querySelector('.content-box > textarea'),
        addCallbacks : function () {
            this.messageField.oninput = () => {
                if (this.messageField.value.trim()) { this.messageField.className = 'inputted'; } 
                else { this.messageField.className = ''; }
            }
        }
    }
    formObject.addCallbacks()

}