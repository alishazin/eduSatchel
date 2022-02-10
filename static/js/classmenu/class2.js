
var allMessagesDiv = {};

function onLoadSecondFile() {
    allMessagesDiv = {
        parent : document.querySelector('body > .parent-content > .main-content > .all-messages'),
        scrollContainer : document.querySelector('body > .parent-content > .main-content'),
        loadingDiv : document.querySelector('body > .parent-content > .main-content > .all-messages > .loading-div'),
        _state : 'normal',
        get state() {
            return this._state;
        },
        set state(arg) {
            if (arg === 'loading') {
                this.loadingDiv.style.transform = 'translateY(0)';
                this.loadingDiv.style.opacity = '1';
            } else if (arg === 'normal') {
                this.loadingDiv.style.transform = 'translateY(-120px)';
                this.loadingDiv.style.opacity = '0';
            }
            this._state = arg;
        },
        stepCount : 1,
        asyncFuncToRequestData : async function () {
            this.state = 'loading';
            const responseArray = await this.sendGetRequest();
            console.log(responseArray)
            this.addDataToListMaster(responseArray);
            this.state = 'normal';
        },
        sendGetRequest : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        console.log(response['stepCount'])
                        allMessagesDiv.stepCount = response['stepCount'];
                        resolve(response['data']);
                    }
                }
                
                req.open('GET', `/class/${classIDGlobal}/get-class-data/${this.stepCount}/`);
                req.send();
            }) 
        },
        addDataToListMaster : function (responseArray) {
            for (let obj of responseArray) {
                if (obj['type'] === 'messagePublic') {
                    addMessageToList(obj)
                }
            }
        },
        addCallbacks : function () {
            this.scrollContainer.onscroll = () => {
                if ((this.scrollContainer.scrollHeight - 3) <= (this.scrollContainer.scrollTop + this.scrollContainer.clientHeight)) {
                    if (this.state === 'normal' && this.stepCount !== 0) {
                        this.asyncFuncToRequestData();
                    }
                }
            }
        }
    }
    allMessagesDiv.addCallbacks();
    allMessagesDiv.asyncFuncToRequestData();
} 

function addMessageToList(response) {
    const listContainer = document.querySelector('body > .parent-content > .main-content > .all-messages')

    const parent = createElementWithAttributes('div', {classList : 'item recieve-msg'})
    
    const topBar = createElementWithAttributes('div', {classList : 'top-bar'})
    const profileImage = createElementWithAttributes('img', {src : response['profilePath']})
    topBar.appendChild(profileImage)

    let senderNameBox;
    if (response['teacher']) {
        senderNameBox = createElementWithAttributes('div', {classList : 'sender-name', color : 'white', bg_color : 'var(--tertiary-color)'})
        senderNameBox.appendChild(createElementWithAttributes('i', {classList : 'bi bi-person-fill'}))
    } else {
        senderNameBox = createElementWithAttributes('div', {classList : 'sender-name'})
    }
    senderNameBox.appendChild(createElementWithAttributes('span', {innerText : response['username']}))
    topBar.appendChild(senderNameBox)

    let dateDiv;
    if (response['date'] == 'Today' || response['date'] == 'Yesterday') {
        dateDiv = createElementWithAttributes('div', {classList : 'date', color : 'var(--tertiary-color)'})
    } else {
        dateDiv = createElementWithAttributes('div', {classList : 'date', color : 'rgb(71, 71, 71)'})
    }
    dateDiv.appendChild(createElementWithAttributes('span', {innerText : response['date']}))
    topBar.appendChild(dateDiv)
    
    const timeDiv = createElementWithAttributes('div', {classList : 'time'})
    timeDiv.appendChild(createElementWithAttributes('span', {innerText : response['time']}))
    topBar.appendChild(timeDiv)
    
    parent.appendChild(topBar)
    
    const contentBox = createElementWithAttributes('div', {classList : 'content-box'})
    contentBox.appendChild(createElementWithAttributes('p', {innerText : response['content']}))
    parent.appendChild(contentBox)

    if (response['urls'].length > 0) {
        const urlMessageBox = createElementWithAttributes('div', {classList : 'url-msg-box'})

        const headerBox = createElementWithAttributes('div', {classList : 'header-box'})
        headerBox.appendChild(createElementWithAttributes('span', {innerText : "URL's"}))
        urlMessageBox.appendChild(headerBox)
        
        const contentBox = createElementWithAttributes('div', {classList : 'content-box'})
        for (let url of response['urls']) {
            const urlContainer = createElementWithAttributes('div', {classList : 'url-container'})
            const span = createElementWithAttributes('span');
            span.appendChild(createElementWithAttributes('a', {href : url, target : '_blank', innerText : url}))
            urlContainer.appendChild(span)
            
            const iconButt = createElementWithAttributes('div', {classList : 'icon-butt'})
            iconButt.onclick = () => {
                copyText(url)
            }
            iconButt.appendChild(createElementWithAttributes('i', {classList : 'bi bi-clipboard'}))
            urlContainer.appendChild(iconButt)
            
            contentBox.appendChild(urlContainer)
        }
        
        urlMessageBox.appendChild(contentBox)
        parent.appendChild(urlMessageBox)
    }

    if (response['files'].length > 0) {
        const fileMsgBox = createElementWithAttributes('div', {classList : 'file-msg-box'})

        const headerBox = createElementWithAttributes('div', {classList : 'header-box'})
        headerBox.appendChild(createElementWithAttributes('span', {innerText : "Files"}))
        fileMsgBox.appendChild(headerBox)

        const contentBox = createElementWithAttributes('div', {classList : 'content-box'})
        for (let file of response['files']) {
            const fileContainer = createElementWithAttributes('div', {classList : 'file-container'})
            const downloadButt = createElementWithAttributes('div', {classList : 'download-butt'})
            downloadButt.onclick = () => {
                downloadFile(file['path'])
            }
            downloadButt.appendChild(createElementWithAttributes('i', {classList : 'bi bi-download'}))
            fileContainer.appendChild(downloadButt)

            const formatParent = createElementWithAttributes('div', {classList : 'format-parent'})
            let formatBox;
            if (file['iconAvailable']) {
                formatBox = createElementWithAttributes('div', {classList : 'format-box'})
                formatBox.appendChild(createElementWithAttributes('i', {classList : `bi bi-filetype-${file['format']}`, fontSize : '25px'}))
            } else {
                formatBox = createElementWithAttributes('div', {classList : 'format-box', padding : '6px 10px', innerText : file['format']})
            }
            formatParent.appendChild(formatBox)

            const bottomBox = createElementWithAttributes('div', {classList : 'bottom-box'})
            bottomBox.appendChild(createElementWithAttributes('span', {innerText : file['name']}))
            
            fileContainer.appendChild(formatParent)
            fileContainer.appendChild(bottomBox)
            contentBox.appendChild(fileContainer)
        }
        
        fileMsgBox.appendChild(contentBox)
        parent.appendChild(fileMsgBox)
    }

    listContainer.appendChild(parent)
}
