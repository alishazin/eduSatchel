
var teacherDetailBox = {};
var sendMessageBox = {};
var moreButtonBox = {};

function onLoad() {
    navBarObj.selectItem(1);

    onLoadSecondFile();

    teacherDetailBox = {
        parent : document.querySelector('body > .parent-content > .right-content > .teacher-details'),
        extendButt : document.querySelector('body > .parent-content > .right-content > .teacher-details > .extend-div'),
        icon : document.querySelector('body > .parent-content > .right-content > .teacher-details > .extend-div > i'),
        _state : false,
        get state() {
            return this._state
        },
        set state(arg) {
            if (arg === true) {
                this.parent.style.height = '525px'; 
                this.icon.style.transform = 'rotate(180deg)';
            } else if (arg === false) {
                this.parent.style.height = '300px'; 
                this.icon.style.transform = 'rotate(0)';
            }
            this._state = arg;
        },
        addCallbacks : function () {
            if (this.extendButt) {
                this.extendButt.onclick = () => {
                    this.state = this.state === true ? false : true;
                }
            }
        }
    };
    teacherDetailBox.addCallbacks();
    
    sendMessageBox = {
        parent : document.querySelector('body > .parent-content > .main-content > .msg-div'),
        overlay : document.querySelector('body > .parent-content > .main-content > .msg-div > .dummy-overlay'),
        contentParent : document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content'),
        errorDiv : document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .top-bar > .error-para'),
        closeButt : document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .top-bar > i'),
        submitButt : document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > .button-box > button'),
        contentInput : document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > textarea'),
        loadingDiv : document.querySelector('body > .parent-content > .main-content > .msg-div > .loading-overlay'),
        _loadingState : false,
        get loadingState() {
            return this._loadingState
        },
        set loadingState(arg) {
            if (arg === true) {
                this.loadingDiv.style.display = 'flex';
            } else if (arg === false) {
                this.loadingDiv.style.display = 'none';
            }
            this._loadingState = arg;
        },
        _state : false,
        get state() {
            return this._state
        },
        set state(arg) {
            if (arg === true) {
                this.parent.style.height = '360px';
                this.overlay.style.display = 'none';
                this.contentParent.style.display = 'flex';
            } else if (arg === false) {
                this.parent.style.height = '80px';
                this.overlay.style.display = 'flex';
                this.contentParent.style.display = 'none';
                attachFileBlockObj.resetAll();
            }
            this._state = arg;
        },
        resetAll : function () {
            this.contentInput.value = '';
            document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > label').style.opacity = '1';
            attachFileBlockObj.resetAll();
        },
        validateForm : function () {
            const content = this.contentInput.value.trim();
            let errorText = ''
            if (!content) {
                errorText = 'Content should not be empty';
            } else if (content.length > 300) {
                errorText = 'Content should be less than 300 characters';
            } else {
                asyncFunctionForSendingMessage();
            }
            this.errorDiv.innerText = errorText;
        },
        getFormData : function () {
            let fileCountLocal = 0;
            let urlCountLocal = 0;
            fileAndUrlData = attachFileBlockObj.getData() 

            const formdata = new FormData();
            formdata.append('content', this.contentInput.value.trim());

            for (let x in fileAndUrlData.files) {
                fileCountLocal++;
                formdata.append(`file-${fileCountLocal}`, fileAndUrlData.files[x]);
            }

            for (let x in fileAndUrlData.urls) {
                urlCountLocal++;
                formdata.append(`url-${urlCountLocal}`, fileAndUrlData.urls[x]);
            }

            sendMessageBox.resetAll();
            return formdata;
        },
        addCallbacks : function () {
            this.overlay.onclick = () => {
                this.state = true;
            }
            this.closeButt.onclick = () => {
                this.state = false;
            }
            this.submitButt.onclick = () => {
                this.validateForm();
            }
        }
    };
    sendMessageBox.addCallbacks();

    moreButtonBox = {
        button : document.querySelector('body > .back-box > .more-button'),
        icon : document.querySelector('body > .back-box > .more-button > i'),
        rightContent : document.querySelector('body > .parent-content > .right-content'),
        _state : false,
        get state() {
            return this._state;
        },
        set state(arg) {
            if (arg === true) {
                this.rightContent.style.right = '0';
                setTimeout(() => {
                    this.rightContent.focus();
                    this.icon.classList = 'bi bi-x';
                }, 500)
            } else if (arg === false) {
                this.rightContent.style.right = '-100%';
                setTimeout(() => {
                    this.icon.classList = 'bi bi-three-dots';
                }, 500)
            }
            this._state = arg;
        },
        addCallbacks : function () {
            this.button.onclick = () => {
                if (this.state === true) {
                    this.state = false;
                } else {
                    this.state = true;
                }
            }
        }
    }
    moreButtonBox.addCallbacks();

    addEventToCopyClassID();
    inputPlaceHolderConstructor(
        document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > textarea'),
        document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > label'),
    )

    return sendMessageBox.errorDiv;
}

function addEventToCopyClassID() {
    const but = document.querySelector('body > .parent-content > .right-content > .class-id > .id-box > .icon-box');
    but.onclick = () => {
        navigator.clipboard.writeText(classIDGlobal);
    }
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

async function asyncFunctionForSendingMessage() {
    try {
        sendMessageBox.loadingState = true;
        const response = await sendPostRequestForMessage();
        sendMessageBox.loadingState = false;
        sendMessageBox.state = false;
        addMessageToList(response, true);
    } catch(error) {
        sendMessageBox.errorDiv.innerText = error;
        sendMessageBox.loadingState = false;
    }
}

function sendPostRequestForMessage() {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);
                if (response['success']) {
                    if (allMessagesDiv.emptyDiv !== null) {
                        allMessagesDiv.emptyDiv.remove();
                        allMessagesDiv.emptyDiv = null;
                    }
                    resolve(response);
                }
                reject(response['error_message'])
            }
        }
        
        req.open('POST', `/class/${classIDGlobal}/send-message/`); 
        req.setRequestHeader("X-CSRFToken", csrftoken); 
        req.send(sendMessageBox.getFormData());
    })
}

function copyText(url) {
    navigator.clipboard.writeText(url)
}

function downloadFile(uri) {
    var link = document.createElement("a");
    link.href = uri;
    link.click();
}

function createElementWithAttributes(tag, paramsObj = {}) {
    const documentElement = document.createElement(tag);
    if (paramsObj['classList']) { documentElement.classList = paramsObj['classList']; } 
    if (paramsObj['id']) { documentElement.id = paramsObj['id']; }
    if (paramsObj['innerText']) { documentElement.innerText = paramsObj['innerText']; }
    if (paramsObj['color']) { documentElement.style.color = paramsObj['color']; }
    if (paramsObj['bg_color']) { documentElement.style.backgroundColor = paramsObj['bg_color']; }
    if (paramsObj['onclick']) { documentElement.onclick = paramsObj['onclick']; }
    if (paramsObj['fontSize']) { documentElement.style.fontSize = paramsObj['fontSize']; }
    if (paramsObj['padding']) { documentElement.style.padding = paramsObj['padding']; }
    if (paramsObj['src']) { documentElement.src = paramsObj['src']; }
    if (paramsObj['href']) { documentElement.href = paramsObj['href']; }
    if (paramsObj['target']) { documentElement.target = paramsObj['target']; }
    return documentElement;
}

function replaceTags(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}