
var switchBool = {
    True : false,
    False : true,
}

var allBusyJoinResponse = {};

var blockRequestObject = {};
var classDescObject = {};

function onLoad() {
    navBarObj.selectItem(3);

    blockRequestObject = {
        switch : document.querySelector('.settings-content > .block-request > .switch-container > .switch'),
        switchBall : document.querySelector('.settings-content > .block-request > .switch-container > .switch > .ball'),
        _state : false,
        get state() {
            return this._state;
        },
        set state(arg) {
            innerAsyncFunc = async (arg) => {
                try {
                    if (arg === true) {
                        this.switch.classList = 'switch loading';
                        await this.sendPostRequestBlockJoin(true);
                        this.switch.classList = 'switch selected';
                    } else if (arg === false) {
                        this.switch.classList = 'switch selected loading';
                        await this.sendPostRequestBlockJoin(false);
                        this.switch.className = 'switch';
                    }
                    this._state = arg;
                } catch(errObj) {
                    if (errObj.name == 'network') {
                        errObj.call();
                    }
                }
            }
            innerAsyncFunc(arg);
            this._state = undefined;
        },
        sendPostRequestBlockJoin : function (arg) {
            return new Promise((resolve, reject) => {
                const formdata = new FormData();
                formdata.append('state', arg)

                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if (this.responseText === 'success') { resolve(); }
                        else { alert(this.responseText) }
                    }
                }

                req.onerror = () => {
                    reject({
                        name : 'network',
                        call : () => {
                            alert("No Active Network Connection")
                        }
                    });
                }
                
                req.open('POST', `/class/${classIDGlobal}/block-join-request/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(formdata);
            })
        },
        addCallbacks : function () {
            this.switch.onclick = () => {
                if (this.state !== undefined) {
                    this.state = this.state === true ? false : true;
                }
            }
        }
    }
    blockRequestObject.addCallbacks();
    const initialState = switchBool[classActive]
    if (initialState === true) {
        blockRequestObject._state = true;
        blockRequestObject.switch.classList = 'switch selected';
    }

    classDescObject = {
        textarea : document.querySelector('.settings-content > .class-desc > textarea'),
        errorDiv : document.querySelector('.settings-content > .class-desc > .error-div'),
        button : document.querySelector('.settings-content > .class-desc > button'),
        _butState : 'disabled',
        get butState() {
            return this._butState;
        },
        set butState(arg) {
            if (arg === 'disabled') {
                this.button.className = 'disabled';
                this.textarea.removeAttribute('readonly')
            } else if (arg === 'enabled') {
                this.button.className = '';
                this.textarea.removeAttribute('readonly')
            } else if (arg === 'loading') {
                this.button.className = 'loading';
                this.textarea.setAttribute('readonly', '')
            }
            this._butState = arg;
        },
        _errorState : 'off',
        get errorState() {
            return this._errorState;
        },
        set errorState(arg) {
            if (arg === 'off') {
                this.errorDiv.className = 'error-div';
                this.errorDiv.innerText = '';
            } else {
                this.errorDiv.classList = 'error-div on';
                this.errorDiv.innerText = arg;
            }
            this._errorState = arg;
        },
        asyncFuncForClassDesc : async function () {
            try {
                if (this.butState === 'enabled') {
                    const value = this.textarea.value.trim();
                    this.errorState = 'off';
                    this.butState = 'loading';
                    await this.sendPostRequestForClassDesc(value);
                    initialClassDesc = value;
                    this.butState = 'disabled';
                }
            } catch(errObj) {
                if (errObj.name === 'network') {
                    errObj.call();
                    this.butState = 'enabled';
                } else {
                    this.errorState = errObj.text;
                    this.butState = 'enabled';
                }
            }
        },
        sendPostRequestForClassDesc : function (value) {  
            return new Promise((resolve, reject) => {
                const formdata = new FormData();
                formdata.append('class_desc', value)
    
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if (this.responseText === 'success') { resolve(); }
                        else { reject({name : 'validationError', text : this.responseText}) }
                    }
                }
    
                req.onerror = () => {
                    reject({
                        name : 'network',
                        call : () => {
                            alert("No Active Network Connection")
                        }
                    });
                }
                
                req.open('POST', `/class/${classIDGlobal}/change-class-desc/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(formdata);
            })
        },
        addCallbacks : function () {
            this.textarea.oninput = () => {
                if (this.butState !== 'loading') {
                    const value = this.textarea.value.trim();
                    if (value === initialClassDesc) {
                        this.butState = 'disabled';
                    } else {
                        this.butState = 'enabled';
                    }
                }
            }
            this.button.onclick = () => {
                if (this.butState === 'enabled') { this.asyncFuncForClassDesc() }
            };
        }
    }
    classDescObject.addCallbacks();

    Array.from(document.querySelectorAll('.join-req-content > .content-box > .item')).forEach(item => {
        allBusyJoinResponse[item.id] = {
            div : item,
            _loadingState : false,
            get loadingState() {
                return this._loadingState;
            },
            set loadingState(arg) {
                if (arg === true) {
                    this.div.style.opacity = '0.6';
                    this.div.className = 'item loading';
                } else if (arg === false) {
                    this.div.children[0].style.backgroundPositionX = '0%';
                    setTimeout(() => {
                        const parent = this.div.parentElement; 
                        this.div.remove();
                        if (parent.children.length == 0) {
                            parent.innerHTML += `
                            <div class="empty-div">
                                <i class="bi bi-binoculars"></i>
                                <span>No Pending Requests</span>
                            </div>
                            `;
                        }
                    }, 400)
                }
                this._loadingState = arg;
            }
        }
    })
}

async function asyncFunctionJoinResponse(self, response, modelID) {
    const parent = self.parentElement;
    if (allBusyJoinResponse[parent.id].loadingState === false) {
        try {
            allBusyJoinResponse[parent.id].loadingState = true;
            await sendPostRequestJoinResponse(response, modelID);
            allBusyJoinResponse[parent.id].loadingState = false;
        } catch(errObj) {
            errObj.call();
        } 
    }
}

function sendPostRequestJoinResponse(response, modelID) {
    return new Promise((resolve, reject) => {
        const formdata = new FormData();
        formdata.append('response', response)

        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText === 'success') { resolve(); }
                else { reject({name : 'validationError', call : () => { alert(this.responseText) }}) }
            }
        }

        req.onerror = () => {
            reject({
                name : 'network',
                call : () => {
                    alert("No Active Network Connection")
                }
            });
        }
        
        req.open('POST', `/class/${classIDGlobal}/join-response/${modelID}/`); 
        req.setRequestHeader("X-CSRFToken", csrftoken); 
        req.send(formdata);
    })
}