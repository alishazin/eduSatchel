
var switchBool = {
    True : false,
    False : true,
}

var blockRequestObject = {};
var classDescObjects = {};

function onLoad() {
    navBarObj.selectItem(2);

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

    classDescObjects = {
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
            } else if (arg === 'enabled') {
                this.button.className = '';
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
            console.log(232132)
        },
        addCallbacks : function () {
            this.textarea.oninput = () => {
                const value = this.textarea.value.trim();
                if (value === initialClassDesc) {
                    this.butState = 'disabled';
                } else {
                    this.butState = 'enabled';
                }
            }
            this.button.onclick = () => {
                if (this.butState === 'enabled') { this.asyncFuncForClassDesc() }
            };
        }
    }
    classDescObjects.addCallbacks();
}