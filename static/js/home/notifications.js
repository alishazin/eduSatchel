
var currentParent = 'primary';

var allData = {
    busy : false,
    stepCount : 1,
    data : [],
    next_id : 1,
    addData : function (data) {
        this.stepCount = data[1];
        updateNotificationAlert(data[2]);
        for (let x of data[0]) {
            x.splice(0, 0, this.next_id)
            this.data.push(x)
            this.next_id++;
        }
    },
    widgetAddedTill : 0,
}

function onLoad() {
    addSelectedToNavBar();
    startAsyncGetData()
    addScrollEventToLeftContainer();
}

function addScrollEventToLeftContainer() {
    const leftContainer = document.querySelector('.parent-content > .left-content'); 
    leftContainer.onscroll = (e) => {
        if ((leftContainer.scrollHeight - 3) <= (leftContainer.scrollTop + leftContainer.clientHeight)) {
            if (allData.busy === false && allData.stepCount !== 0) {
                startAsyncGetData();
            }
        }
    }
}

async function startAsyncGetData() {
    if (allData.stepCount !== 0) {
        try {
            allData.busy = true;
            leftContainerLoadingController(true);
            
            const data = await sendGetRequestToGetData();
            await allData.addData(data);
            
            leftContainerLoadingController(false);
            
            addItemsContainers();
            allData.busy = false;
            
        } catch(error) {
            if (error === 'no network') {
                raiseNoNetworkError();
            } else if (error === 'Error From Backend') {
                alert('Something went wrong. Refresh the page ?')
                location.href = "/home/notifications/";
            }
    
        }
    }
}

function addItemsContainers() {
    const leftContainer = document.querySelector('.parent-content > .left-content'); 
    const data = allData.data;
    for (let i = allData.widgetAddedTill; i < allData.next_id - 1; i++) {
        let subData = data[i];
        let messageHeaderItem = null;
        if (subData[5] === false) { messageHeaderItem = createElementWithClass('div', ['msg-header-item', 'seen']) }
        else { messageHeaderItem = createElementWithClass('div', ['msg-header-item']) }

        const hiddenID = createElementWithClass('div', ['msg_id'], subData[0])
        const seenBox = createElementWithClass('div', ['seen-box'])

        const ball = createElementWithClass('div', ['ball'])
        seenBox.appendChild(ball)

        const headerArea = createElementWithClass('div', ['header-area'])

        const paraHeader = createElementWithClass('p', [], subData[1])
        headerArea.appendChild(paraHeader)

        const dateArea = createElementWithClass('div', ['date-area'])

        const paraDate = createElementWithClass('p', [], subData[3])
        dateArea.appendChild(paraDate)

        messageHeaderItem.appendChild(hiddenID)
        messageHeaderItem.appendChild(seenBox)
        messageHeaderItem.appendChild(headerArea)
        messageHeaderItem.appendChild(dateArea)

        leftContainer.appendChild(messageHeaderItem);
    }
    allData.widgetAddedTill = allData.next_id - 1
}

function leftContainerLoadingController(state) {
    const leftContainer = document.querySelector('.parent-content > .left-content'); 
    if (state === true) {
        const loadingBox = createElementWithClass('div', ['loading-box']);

        const spinner = createElementWithClass('div', ['spinner'])
        loadingBox.appendChild(spinner);
        
        const para = createElementWithClass('p', [], 'Loading')
        loadingBox.appendChild(para);

        leftContainer.appendChild(loadingBox);
    } else if (state === false) {
        document.querySelector('.parent-content > .left-content > .loading-box').remove();
    }
} 

function createElementWithClass(tag, classList = [], innerText = '') {
    const element = document.createElement(tag);
    element.innerText = innerText;
    classList.forEach((classAdd) => {
        element.classList += ` ${classAdd}`;
    })
    return element
}

function updateNotificationAlert(num) {
    const counter = document.querySelector('body > .nav-bar > .content-box > i > .counter');
    if (num === false) {
        counter.style.display = 'none';
    } else {
        counter.style.display = 'flex';
        counter.innerText = num;
    }
}

function raiseNoNetworkError() {
    const noNetworkDiv = document.querySelector('.parent-content > .no-network-box');
    if (currentParent === 'primary') {
        const leftContainer = document.querySelector('.parent-content > .left-content');
        const rightContainer = document.querySelector('.parent-content > .right-content');
        
        leftContainer.style.display = 'none';
        rightContainer.style.display = 'none';
    }
    noNetworkDiv.style.display = 'flex';
}

function sendGetRequestToGetData() {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText === 'Invalid stepCount') {
                    reject("Error From Backend")
                } else {
                    const parsedResponse = JSON.parse(this.responseText);
                    resolve(parsedResponse);
                }
            }
        }
        req.onerror = function() {
            reject('no network');
        }
        req.open('GET', `/home/notifications/get-data/${allData.stepCount}`);
        req.send();
    })
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#notification-box').classList += ' selected';
}