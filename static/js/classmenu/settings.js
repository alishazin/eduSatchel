
var switchBool = {
    True : false,
    False : true,
}

var blockRequestObject = {};

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
}