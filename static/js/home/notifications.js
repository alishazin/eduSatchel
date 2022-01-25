
var currentParent = {
    _state : 'primary',
    get state () {
        return this._state
    },
    set state (arg) {
        const leftContainer = document.querySelector('.parent-content > .left-content');
        const rightContainer = document.querySelector('.parent-content > .right-content');
        const smallContent = document.querySelector('.parent-content > .small-content');
        if (arg === 'primary') {
            smallContent.style.display = 'none'
            
            leftContainer.style.display = 'flex';
            rightContainer.style.display = 'flex';
        } else if (arg === 'secondary') {
            leftContainer.style.display = 'none';
            rightContainer.style.display = 'none';

            smallContent.style.display = 'block';
        }
        this._state = arg;
    }
};
// primary(750px and above), secondary(less than 750px)

var currentDropDown = {
    arrow : null,
    dropdown : null,
}

var allData = {
    busy : false,
    stepCount : 1,
    data : {},
    next_id : 1,
    addData : function (data) {
        this.stepCount = data[1];
        updateNotificationAlert(data[2]);
        for (let x of data[0]) {
            this.data[this.next_id] = x;
            this.next_id++;
        }
    },
    widgetAddedTill : 0,
}

var rightContent = {
    currentlySelected : null,
    seen : false,
}

function onLoad() {
    addSelectedToNavBar();
    startAsyncGetData()
    addScrollEventToLeftContainer();
    addScrollEventToSmallContainer();
    addClickEventToLeftContainerItems();
    addResponsiveness();
    addClickEventToDropdown();
    addFocusEventToDropdown();
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

function addScrollEventToSmallContainer() {
    const smallContainer = document.querySelector('.parent-content > .small-content'); 
    smallContainer.onscroll = (e) => {
        if ((smallContainer.scrollHeight - 3) <= (smallContainer.scrollTop + smallContainer.clientHeight)) {
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
            smallContainerLoadingController(true);
            
            const data = await sendGetRequestToGetData();
            await allData.addData(data);
            
            leftContainerLoadingController(false);
            smallContainerLoadingController(false);
            allData.busy = false;
            
            addItemsContainers();
            
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
    const smallContainer = document.querySelector('.parent-content > .small-content'); 
    const data = allData.data;
    for (let i = allData.widgetAddedTill + 1; i < allData.next_id; i++) {
        let subData = data[i];

        // Left Container
        let messageHeaderItem = null;
        if (subData[4] === false) { messageHeaderItem = createElementWithClass('div', ['msg-header-item', 'seen']) }
        else { messageHeaderItem = createElementWithClass('div', ['msg-header-item']) }

        const hiddenID = createElementWithClass('div', ['msg_id'], i)
        const seenBox = createElementWithClass('div', ['seen-box'])

        const ball = createElementWithClass('div', ['ball'])
        seenBox.appendChild(ball)

        const headerArea = createElementWithClass('div', ['header-area'])

        const paraHeader = createElementWithClass('p', [], subData[0])
        headerArea.appendChild(paraHeader)

        const dateArea = createElementWithClass('div', ['date-area'])

        const paraDate = createElementWithClass('p', [], subData[2])
        dateArea.appendChild(paraDate)

        messageHeaderItem.appendChild(hiddenID)
        messageHeaderItem.appendChild(seenBox)
        messageHeaderItem.appendChild(headerArea)
        messageHeaderItem.appendChild(dateArea)

        leftContainer.appendChild(messageHeaderItem);

        // Small Container
        let smallItem = null;
        if (subData[4] === false) { smallItem = createElementWithClass('div', ['small-item', 'seen']) }
        else { smallItem = createElementWithClass('div', ['small-item']) }
        
        const visiblePart = createElementWithClass('div', ['visible-part'])
        const seenBoxSmall = createElementWithClass('div', ['seen-box'])
        
        const ballSmall = createElementWithClass('div', ['ball'])
        seenBoxSmall.appendChild(ballSmall)
        visiblePart.appendChild(seenBoxSmall)
        
        const header = createElementWithClass('div', ['header'])
        
        const paraHeaderSmall = createElementWithClass('p', [], subData[0])
        header.appendChild(paraHeaderSmall)
        visiblePart.appendChild(header)
        
        const buttBox = createElementWithClass('div', ['button-box'])
        
        const icon = createElementWithClass('i', ['bi','bi-caret-down'])
        buttBox.appendChild(icon)
        visiblePart.appendChild(buttBox)
        
        smallItem.appendChild(visiblePart)

        const dropdownPart = createElementWithClass('div', ['dropdown-part'])
        dropdownPart.tabIndex = '0'

        const headerDrop = createElementWithClass('div', ['header'], subData[0])
        dropdownPart.appendChild(headerDrop)
        
        const contentDrop = createElementWithClass('div', ['content'], subData[1])
        dropdownPart.appendChild(contentDrop)

        const extraContent = createElementWithClass('div', ['extra-content'])

        const timeExtra = createElementWithClass('div', ['time'], subData[3])
        const dateExtra = createElementWithClass('div', ['date'], subData[2])
        extraContent.appendChild(timeExtra)
        extraContent.appendChild(dateExtra)

        dropdownPart.appendChild(extraContent)

        smallItem.appendChild(dropdownPart)

        smallContainer.appendChild(smallItem)
    }
    allData.widgetAddedTill = allData.next_id - 1

    // Adding onclick Event
    addClickEventToLeftContainerItems();
    addClickEventToDropdown();
    addFocusEventToDropdown();
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

function smallContainerLoadingController(state) {
    const smallContainer = document.querySelector('.parent-content > .small-content'); 
    if (state === true) {
        const loadingBox = createElementWithClass('div', ['loading-box']);

        const spinner = createElementWithClass('div', ['spinner'])
        loadingBox.appendChild(spinner);
        
        const para = createElementWithClass('p', [], 'Loading')
        loadingBox.appendChild(para);

        smallContainer.appendChild(loadingBox);
    } else if (state === false) {
        document.querySelector('.parent-content > .small-content > .loading-box').remove();
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
    if (currentParent.state === 'primary') {
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

function addClickEventToLeftContainerItems() {
    const leftContainerItems = Array.from(document.querySelectorAll('.parent-content > .left-content > .msg-header-item'));
    leftContainerItems.forEach((item) => {
        item.onclick = () => {
            addContentToRightContainer(item.children[0].innerText, item);
        }
    })
}

function addContentToRightContainer(id, element) {
    const header = document.querySelector('.parent-content > .right-content > .content-box > .header');
    const content = document.querySelector('.parent-content > .right-content > .content-box > .content');
    const date = document.querySelector('.parent-content > .right-content > .content-box > .date-box > .date');
    const time = document.querySelector('.parent-content > .right-content > .content-box > .date-box > .time');
    const star = document.querySelector('.parent-content > .right-content > .content-box > .date-box > i');

    if (rightContent.currentlySelected !== null) {
        rightContent.currentlySelected.classList = rightContent.seen === true ? 'msg-header-item' : 'msg-header-item seen'
    }

    const data = allData.data[id];
    header.innerText = `${data[0]},`;
    content.innerText = `${data[1]}`;
    date.innerText = `${data[2]}`;
    time.innerText = `${data[3]}`;
    star.id = data[4] === true ? 'seen' : 'unseen';

    rightContent.currentlySelected = element;
    rightContent.seen = data[4];
    element.classList += ' selected';
}

function addResponsiveness() {
    (window.onresize = () => {
        const width = window.innerWidth;
        if (width >= 750 && currentParent.state === 'secondary') {
            currentParent.state = 'primary'
        } else if (width < 750 && currentParent.state === 'primary') {
            currentParent.state = 'secondary'
        }
    })();
}

function addClickEventToDropdown() {
    const smallContainerItems = Array.from(document.querySelectorAll('.parent-content > .small-content > .small-item > .visible-part'));
    smallContainerItems.forEach((item) => {
        item.onclick = () => {
            if (currentDropDown.arrow !== null) {
                //  This code, if user chooses to do fast
                currentDropDown.arrow.style.transform = 'rotate(0)';
                currentDropDown.dropdown.style.overflow = 'hidden';
                currentDropDown.dropdown.className = 'dropdown-part';
            }
            const dropdown = item.parentElement.children[1];
            dropdown.classList += ' open';
            setTimeout(() => {
                dropdown.style.overflow = 'auto';
            }, 500);
            
            currentDropDown.arrow = item.children[2].children[0];
            currentDropDown.arrow.style.transform = 'rotate(180deg)';
            currentDropDown.dropdown = dropdown;
            setTimeout(() => {
                item.parentElement.children[1].focus();
            }, 500)
        }
    })
}

function addFocusEventToDropdown() {
    const dropdownBoxes = Array.from(document.querySelectorAll('.parent-content > .small-content > .small-item > .dropdown-part'));
    dropdownBoxes.forEach((dropdown) => {
        dropdown.onblur = () => {
            currentDropDown.arrow.style.transform = 'rotate(0)';
            currentDropDown.dropdown.style.overflow = 'hidden';
            currentDropDown.dropdown.className = 'dropdown-part';

            currentDropDown.arrow = null;
            currentDropDown.dropdown = null;
        }
    })
}