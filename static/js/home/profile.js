
var loadingObj = {};

function onLoad() {
    addSelectedToNavBar();
    addHoverEventToEditPopup();
    addEventToInput();

    loadingObj = {
        div : document.querySelector('.parent-content > .top-box > .profile-holder > .loading-box'),
        popupBox : document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box'),
        _state : false,
        get state() {
            return this._state;
        },
        set state(arg) {
            if (arg == true) {
                this.div.style.display = 'flex';
                this.popupBox.style.display = 'none';
            } else if (arg == false) {
                this.div.style.display = 'none';
                this.popupBox.style.display = 'flex';
            }
            this._state = arg;
        }
    }
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#profile-box').classList += ' selected';
}

function sendPOSTRequest() {
    setInterval(() => {
        const fileInput = document.querySelector('.parent-content > input');
        console.log(fileInput.files[0]);
    }, 1000)
}

function addHoverEventToEditPopup() {
    const popup = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box');
    const inputFile = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > input');
    popup.onmouseover = () => {
        setTimeout(() => {
            inputFile.removeAttribute('disabled');
        }, 300)
    }
    popup.onmouseleave = () => {
        inputFile.setAttribute('disabled', true);
    }
}

function addEventToInput() {
    const inputFile = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > input');
    inputFile.onchange = () => {
        asyncImageUploadAndOpen(inputFile.files[0]);
    }
}

async function asyncImageUploadAndOpen(file) {
    loadingObj.state = true;
}