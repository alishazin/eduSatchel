
var leaveClassObject = {}

function onLoad() {
    navBarObj.selectItem(2);

    leaveClassObject = {
        button : document.querySelector('.settings-content > .leave-class > button'),
        _loadingState : false,
        get loadingState() {
            return this._loadingState;
        },
        set loadingState(arg) {
            if (arg === true) {
                this.button.classList = 'loading'
            } else if (arg === false) {
                this.button.classList = ''
            }
            this._loadingState = arg
        },
        asyncFunc : async function () {
            try {
                this.loadingState = true
                await this.sendPostRequest()
                this.loadingState = false
                location.href = `/home/`
            } catch(err) {
                err.call()
                this.loadingState = false
            }
        },
        sendPostRequest : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText)
                        if (response.success === true) {
                            resolve()
                        } else {
                            reject({
                                name : 'failed',
                                call : () => {
                                    alert("Something Went Wrong")
                                }
                            })
                        }
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
                
                req.open('POST', `/class/${classIDGlobal}/settings/leave/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send();
            })
        },
        addCallback : function () {
            this.button.onclick = () => {
                if (this.loadingState === false) {
                    const confirmation = window.confirm(`Are you sure about leaving from the class '${classTitle}' ?\n1. All your submissions and messages will be removed.\n2. Options polled by you will remain.\n3. You can send join request in the future.\n4. This change is irreversible`)
                    if (confirmation) {
                        this.asyncFunc()
                    }
                }
            }
        },
    }

    leaveClassObject.addCallback()
}