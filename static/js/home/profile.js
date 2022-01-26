
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

function addHoverEventToEditPopup() {
    const popup = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box');
    const inputFile = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > input');
    popup.onmouseover = () => {
        setTimeout(() => {
            inputFile.removeAttribute('disabled');
        }, 500)
    }
    popup.onmouseleave = () => {
        inputFile.setAttribute('disabled', true);
    }
}

function addEventToInput() {
    const inputFile = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > input');
    const removeProfileButt = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > .row-two');
    inputFile.onchange = () => {
        const formdata = new FormData();
        formdata.append('testprofile', inputFile.files[0]);
        asyncImageUploadAndOpen(formdata);
    }
    removeProfileButt.onclick = () => {
        asyncRemoveProfileAndOpen();
    }
}

async function asyncRemoveProfileAndOpen() {
    try {
        loadingObj.state = true;
        await sendPOSTRequestRemoveProfile();
        loadingObj.state = false;
        location.href = '/home/profile/';
    } catch(error) {
        if (error == 'invalid') {
            loadingObj.state = false;
            document.querySelector('.parent-content > .top-box > .error').innerText = 'No Profile Added Yet!';
        }
    }
}

async function asyncImageUploadAndOpen(formdata) {
    try {
        loadingObj.state = true;
        await sendPOSTRequestChangeProfile(formdata);
        loadingObj.state = false;
        location.href = '/home/profile/';
    } catch(error) {
        if (error == 'invalid') {
            loadingObj.state = false;
            document.querySelector('.parent-content > .top-box > .error').innerText = 'Invalid Image Format!';
        }
    }
}

function sendPOSTRequestRemoveProfile() {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = this.responseText;
                if (response == 'invalid') {
                    reject("invalid")
                } else if (response == 'success') {
                    resolve(response);
                }
            }
        }
        req.open('POST', '/home/profile/remove-profile/'); 
        req.setRequestHeader("X-CSRFToken", csrftoken); 
        req.send();
    })
}
function sendPOSTRequestChangeProfile(formdata) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = this.responseText;
                if (response == 'invalid') {
                    reject("invalid")
                } else if (response == 'success') {
                    resolve(response);
                }
            }
        }
        req.open('POST', '/home/profile/change-profile/'); 
        req.setRequestHeader("X-CSRFToken", csrftoken); 
        req.send(formdata);
    })
}