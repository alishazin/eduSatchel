
var teacherDetailBox = {};
var sendMessageBox = {};

function onLoad() {
    navBarObj.selectItem(1);

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
        closeButt : document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .top-bar > i'),
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
            }
        },
        addCallbacks : function () {
            this.overlay.onclick = () => {
                this.state = true;
            }
            this.closeButt.onclick = () => {
                this.state = false;
            }
        }
    };
    sendMessageBox.addCallbacks();

    addEventToCopyClassID();
    inputPlaceHolderConstructor(
        document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > textarea'),
        document.querySelector('body > .parent-content > .main-content > .msg-div > .real-content > .content-box > .form > label'),
    )
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