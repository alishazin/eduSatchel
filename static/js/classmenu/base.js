
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
        selectItem : function (arg) {
            const allItems = Array.from(document.querySelectorAll('body > .parent-content > .nav-bar-box > .nav-bar > .item'));
            allItems[arg - 1].classList += ' selected';
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

function directToPage(url) {
    location.href = url;
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