
var allNotificationData = {};

var loadingObj = {};

var noNetworkObj = {};

var noNetworkError = {};

var parentContainerChildren = [loadingObj, noNetworkObj];

function onLoad() {

    allNotificationData = {
        data : [],
        stepCount : 1,
        updateData : function (data) {
            // Will Add
        }
    };

    loadingObj = {
        div : document.querySelector('.parent-content > .loading-box'),
        _state : true,
        get state() {
            return this._state
        },
        set state(arg) {
            if (arg === true) { this.div.style.display = 'flex' }
            else if (arg === false) { this.div.style.display = 'none' }
        }
    };

    noNetworkObj = {
        div : document.querySelector('.parent-content > .no-network-box'),
        _state : false,
        get state() {
            return this._state
        },
        set state(arg) {
            if (arg === true) { this.div.style.display = 'flex' }
            else if (arg === false) { this.div.style.display = 'none' }
        }
    }

    noNetworkError = {
        message : 'No Netwok',
        executable : () => {
            loadingObj.state = false;
            noNetworkObj.state = true;
        }
    }

    addSelectedToNavBar();
    startAsyncGetData()
}

async function startAsyncGetData() {
    try {
        console.log(await sendPostRequestAndGetData()); 
    } catch(errorObj) {
        errorObj.executable();
    }
}

function sendPostRequestAndGetData() {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const parsedResponse = JSON.parse(this.responseText);
                resolve(parsedResponse);
            }
        }
        req.onerror = function() {
            reject(noNetworkError);
        }
        req.open('GET', `/home/notifications/get-data/${allNotificationData.stepCount}`);
        req.send();
    })
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#notification-box').classList += ' selected';
}

