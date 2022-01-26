
var loadingObj = {};
var bioButton = {};
var bioLoading = {};

function onLoad() {
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
    if (accountType === 'teacher') {
        bioLoading = {
            div : document.querySelector('.parent-content > .extra-box > .bio-box > .spinner'),
            _state : false,
            get state() {
                return this._state;
            },
            set state(arg) {
                if (arg == true) {
                    this.div.style.display = 'block';
                } else if (arg == false) {
                    this.div.style.display = 'none';
                }
                this._state = arg;
            }
        }
    
        bioButton = {
            div : document.querySelector('.parent-content > .extra-box > .bio-box > button'),
            _disabled : true, 
            get disabled() {
                return this._disabled;
            },
            set disabled(arg) {
                if (arg === true) {
                    this.div.className = 'disabled';
                } else if (arg === false) {
                    this.div.className = '';
                }
                this._disabled = arg;
            },
        }
        bioButton.div.addEventListener('click', asyncChangeBio);
        compareBioInput();
    }

    addSelectedToNavBar();
    addHoverEventToEditPopup();
    addEventToInput();
}

async function asyncChangeBio() {
    if (bioButton.disabled == false) {
        bioLoading.state = true;
        bioButton.disabled = true;
        const newBio = await sendPOSTRequestUpdateBio();
        bioLoading.state = false;
    }
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#profile-box').classList += ' selected';
}

function compareBioInput() {
    const input = document.querySelector('.parent-content > .extra-box > .bio-box > textarea');
    input.oninput = () => {
        const value = input.value.trim();
        if (initialBio != value && bioButton.disabled == true) {
            bioButton.disabled = false;
        } else if (initialBio == value && bioButton.disabled == false) {
            bioButton.disabled = true;
        }
    }
}

function addHoverEventToEditPopup() {
    const popup = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box');
    const inputFile = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > input');
    const removeProfileButt = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > .row-two');
    popup.onmouseover = () => {
        setTimeout(() => {
            inputFile.removeAttribute('disabled');
            removeProfileButt.addEventListener('click', asyncRemoveProfileAndOpen);
        }, 500)
    }
    popup.onmouseleave = () => {
        inputFile.setAttribute('disabled', true);
        removeProfileButt.removeEventListener('click', asyncRemoveProfileAndOpen);
    }
}

function addEventToInput() {
    const inputFile = document.querySelector('.parent-content > .top-box > .profile-holder > .popup-box > label > input');
    inputFile.onchange = () => {
        const formdata = new FormData();
        formdata.append('testprofile', inputFile.files[0]);
        asyncImageUploadAndOpen(formdata);
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

function sendPOSTRequestUpdateBio() {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = this.responseText;
                console.log(response);
            }
        }
        req.open('POST', '/home/profile/update-bio/'); 
        req.setRequestHeader("X-CSRFToken", csrftoken); 
        req.send();
    })
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