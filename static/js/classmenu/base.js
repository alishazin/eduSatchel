
var navBarObj = {};

function onBaseLoad() {
    addEventToBaseBackButton();

    navBarObj = {
        boxDiv : document.querySelector('body > .parent-content > .nav-bar-box'),
        barDiv : document.querySelector('body > .parent-content > .nav-bar-box > .nav-bar'),
        pullerDiv : document.querySelector('body > .parent-content > .nav-bar-box > .nav-puller'),
        pullerIcon : document.querySelector('body > .parent-content > .nav-bar-box > .nav-puller > i'),
        extendIcon : document.querySelector('body > .parent-content > .nav-bar-box > .nav-bar > .last-item > i'),
        _extendState : false,
        _state : false,
        get state() {
            return this._state;
        },
        set state(arg) {
            if (arg === true) {
                this.boxDiv.style.left = '0';
                this.pullerIcon.style.transform = 'rotate(-180deg)';
                setTimeout(() => { this.barDiv.focus() }, 400)
            } else if (arg === false) {
                this.extendState = false;
                this.boxDiv.style.left = '-90px';
                this.pullerIcon.style.transform = 'rotate(0)';
            }
            setTimeout(() => {
                this._state = arg;
            }, 400)
        },
        get extendState() {
            return this._extendState;
        },
        set extendState(arg) {
            if (window.innerWidth > 300) {
                if (arg === true) {
                    this.boxDiv.style.width = '280px';
                    this.barDiv.style.width = '250px';
                    this.extendIcon.style.transform = 'rotate(-180deg)';
                } else if (arg === false) {
                    this.boxDiv.style.width = '130px';
                    this.barDiv.style.width = '90px';
                    this.extendIcon.style.transform = 'rotate(0)';
                }
            }
            this._extendState = arg;
        },
        setCallbacks : function () {
            this.pullerDiv.onclick = () => {
                navBarObj.state = navBarObj.state === true ? false : true;
            }
            
            this.pullerDiv.onmouseover = () => {
                navBarObj.pullerDiv.style.transform = navBarObj.state === true ? 'translateX(-15px)' : 'translateX(0)';
            }
            
            this.pullerDiv.onmouseleave = () => {
                navBarObj.pullerDiv.style.transform = 'translateX(-10px)';
            }
            
            this.barDiv.onblur = () => {
                navBarObj.state = false;
            }
            this.extendIcon.onclick = () => {
                navBarObj.extendState = navBarObj.extendState === true ? false : true;
            }
        },
    }

    navBarObj.setCallbacks();

}

function addEventToBaseBackButton() {
    const but = document.querySelector('body > .back-box > .back-button');
    but.onclick = () => {
        location.href = homeURL;
    }
}