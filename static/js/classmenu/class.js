
var teacherDetailBox = {};

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
            this.extendButt.onclick = () => {
                this.state = this.state === true ? false : true;
            }
        }
    };
    teacherDetailBox.addCallbacks();

    addEventToCopyClassID();
}

function addEventToCopyClassID() {
    const but = document.querySelector('body > .parent-content > .right-content > .class-id > .id-box > .icon-box');
    but.onclick = () => {
        navigator.clipboard.writeText(classIDGlobal);
    }
}