
var allMessagesDiv = {};

var allPollObjects = {};

function onLoadSecondFile() {
    allMessagesDiv = {
        parent : document.querySelector('body > .parent-content > .main-content > .all-messages'),
        scrollContainer : document.querySelector('body > .parent-content > .main-content'),
        loadingDiv : document.querySelector('body > .parent-content > .main-content > .all-messages > .loading-div'),
        emptyDiv : null,
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
            try {
                this.state = 'loading';
                const response = await this.sendGetRequest();
                this.addDataToListMaster(response);
                this.state = 'normal';
            } catch(errorObj) {
                this.state = 'normal';
                errorObj.call();
            }
        },
        sendGetRequest : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        allMessagesDiv.stepCount = response['stepCount'];
                        if (response['empty']) {
                            reject({
                                type : 'empty',
                                call : () => {
                                    allMessagesDiv.raiseEmptyDiv();
                                }
                            })
                        }
                        resolve(response);
                    }
                }

                req.onerror = () => {
                    reject({
                        type : 'network',
                        call : () => {
                            alert("No Active Network Connection")
                        }
                    });
                }
                
                req.open('GET', `/class/${classIDGlobal}/get-class-data/${this.stepCount}/`);
                req.send();
            }) 
        },
        raiseEmptyDiv : function () {
            const parent = createElementWithAttributes('div', {classList : 'item empty-div'})

            const iconBox = createElementWithAttributes('div', {classList : 'icon-box'})
            iconBox.appendChild(createElementWithAttributes('i', {classList : 'bi bi-chat-text'}))
            parent.appendChild(iconBox)
            
            const textBox = createElementWithAttributes('div', {classList : 'text-box'})
            textBox.appendChild(createElementWithAttributes('h2', {innerText : 'No Activities Yet!'}))
            textBox.appendChild(createElementWithAttributes('span', {innerText : 'You can be the first one.'}))
            parent.appendChild(textBox)
            this.parent.appendChild(parent)

            this.emptyDiv = parent;
        },
        addDataToListMaster : function (response) {
            for (let obj of response['data']) {
                if (obj['type'] === 'messagePublic') { addMessageToList(obj) }
                else if (obj['type'] === 'assignment') { addAssignmentToList(obj) }
                else if (obj['type'] === 'poll') { addPollToList(obj, response['teacher']) }
                else if (obj['type'] === 'date') { addDateStampToList(obj) }
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

function addMessageToList(response, beginning = false) {
    const listContainer = document.querySelector('body > .parent-content > .main-content > .all-messages')

    const parent = createElementWithAttributes('div', {classList : 'item recieve-msg'})
    
    const topBar = createElementWithAttributes('div', {classList : 'top-bar'})
    const profileImage = createElementWithAttributes('img', {src : `${response['profilePath']}`})
    topBar.appendChild(profileImage)

    let senderNameBox;
    if (response['teacher']) {
        senderNameBox = createElementWithAttributes('div', {classList : 'sender-name', color : 'black', bg_color : 'var(--quaternary-color)'})
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
                downloadFile(`${media_url}${file['path']}`)
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

    if (beginning) {
        listContainer.prepend(parent)

        parent.style.animationName = 'blink-new';
        parent.style.animationDuration = '2s';
        parent.style.animationIterationCount = '3';
    } else {
        listContainer.append(parent)
    }
}

function addAssignmentToList(response) {
    const listContainer = document.querySelector('body > .parent-content > .main-content > .all-messages')

    const parent = createElementWithAttributes('div', {classList : 'item assignment-box'})
    parent.onclick = () => {
        location.href = response['onclick_url']
    }

    const topBar = createElementWithAttributes('div', {classList : 'top-bar'})

    const iconBox = createElementWithAttributes('div', {classList : 'icon-box'})
    iconBox.appendChild(createElementWithAttributes('i', {classList : 'bi bi-clipboard2-check'}))
    topBar.appendChild(iconBox)
    
    topBar.appendChild(createElementWithAttributes('div', {classList : 'text-box', innerText : 'Assignment'}))
    
    let date; 
    if (response['date'] == 'Today' || response['date'] == 'Yesterday') {
        date = createElementWithAttributes('div', {classList : 'date', color : 'var(--tertiary-color)'})
    } else {
        date = createElementWithAttributes('div', {classList : 'date'})
    }
    date.appendChild(createElementWithAttributes('span', {innerText : response['date']}))
    topBar.appendChild(date)
    
    const time = createElementWithAttributes('div', {classList : 'time'})
    time.appendChild(createElementWithAttributes('span', {innerText : response['time']}))
    topBar.appendChild(time)
    
    parent.appendChild(topBar)
    
    const contentBox = createElementWithAttributes('div', {classList : 'content-box'})
    contentBox.appendChild(createElementWithAttributes('p', {innerText : response['content']}))
    
    contentBox.appendChild(createElementWithAttributes('i', {classList : 'bi bi-chevron-double-right'}))

    parent.appendChild(contentBox)

    listContainer.appendChild(parent)
}

function addPollToList(response, isTeacher) {
    const currentPollObj = allPollObjects[response['id']] = {
        div : null,
        title : response['title'],
        options : {},
        totalDiv : null,
        closeButt : null,
        bottomBar : null,
        closed : response['closed'],
        _state : null,
        get state() {
            return this._state;
        },
        set state(arg) {
            if (arg === 'voted') {
                this.div.classList = 'option-box after';
                if (this.closeButt) {this.closeButt.classList = '';}
            } else if (arg === 'due') {
                this.div.classList = 'option-box before';
                if (this.closeButt) {this.closeButt.classList = '';}
            } else if (arg === 'loading') {
                this.div.classList = 'option-box loading';
                if (this.closeButt) {this.closeButt.classList = '';}
            } else if (arg === 'close-loading') {
                this.closeButt.classList = 'loading';
            }
            this._state = arg;
        },
        addData : function (detailsObj) {
            for (let id in detailsObj['result']) {

                this.options[id].percentageDiv.innerText = `${Number(detailsObj['result'][id]).toFixed()}`
                this.options[id].parent.style.backgroundPositionX = `${100 - detailsObj['result'][id]}%`
            }

            if (detailsObj['selected']) { this.options[detailsObj['selected']].parent.classList = 'option selected' } 
        },
        asyncFuncForPostRequest : async function (id) {
            try {
                this.state = 'loading';
                const response = await this.sendPostRequest(id);
                this.addData(response['optionDetails'])
                this.totalDiv.innerText = `${response['total']} vote(s)`
                this.state = 'voted';
            } catch(errMsg) {
                alert(errMsg);
                if (this.closed) { this.state = 'voted'; }
                else { this.state = 'due'; }  
            }
        },
        sendPostRequest : function (id) {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        if (response['success']) {
                            resolve(response)
                        } else {
                            reject(response['error_message'])
                        }
                    }
                }
                
                req.open('POST', `/class/${classIDGlobal}/poll-casted/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send(this.getFormData(id));
            })
        },
        getFormData : function (id) {
            const formdata = new FormData()
            formdata.append('id', id)
            return formdata
        },
        replaceCloseButt : function () {
            this.bottomBar.replaceChild(bottomBar.appendChild(createElementWithAttributes('span', {classList : 'state', innerText : 'closed', color : 'red'})), this.closeButt)
        }
    }

    const listContainer = document.querySelector('body > .parent-content > .main-content > .all-messages')

    const parent = createElementWithAttributes('div', {classList : 'item poll-box'})

    const topBar = createElementWithAttributes('div', {classList : 'top-bar'})

    const iconBox = createElementWithAttributes('div', {classList : 'icon-box'})
    iconBox.appendChild(createElementWithAttributes('i', {classList : 'bi bi-pie-chart'}))
    topBar.appendChild(iconBox)
    
    topBar.appendChild(createElementWithAttributes('div', {classList : 'text-box', innerText : 'Poll'}))
    
    let date; 
    if (response['date'] == 'Today' || response['date'] == 'Yesterday') {
        date = createElementWithAttributes('div', {classList : 'date', color : 'var(--tertiary-color)'})
    } else {
        date = createElementWithAttributes('div', {classList : 'date'})
    }
    date.appendChild(createElementWithAttributes('span', {innerText : response['date']}))
    topBar.appendChild(date)
    
    const time = createElementWithAttributes('div', {classList : 'time'})
    time.appendChild(createElementWithAttributes('span', {innerText : response['time']}))
    topBar.appendChild(time)
    
    parent.appendChild(topBar)

    const contentBox = createElementWithAttributes('div', {classList : 'content-box'})
    contentBox.appendChild(createElementWithAttributes('div', {classList : 'title-box', innerText : response['title']}))
    
    const optionBox = createElementWithAttributes('div', {classList : 'option-box'})
    optionBox.appendChild(createElementWithAttributes('div', {classList : 'id', innerText : response['id']}))
    currentPollObj.div = optionBox
    for (let pollObj of response['options']) {
        const optionParent = createElementWithAttributes('div', {classList : 'option'})
        optionParent.onclick = () => {
            if (currentPollObj.state === 'due' && !currentPollObj.closed) {
                currentPollObj.asyncFuncForPostRequest(pollObj['id'])
            }
        }
        optionParent.appendChild(createElementWithAttributes('div', {classList : 'id', innerText : pollObj['id']}))
        
        const leftBox = createElementWithAttributes('div', {classList : 'left-box'})
        leftBox.appendChild(createElementWithAttributes('i', {classList : 'bi bi-check2'}))
        const span = createElementWithAttributes('span')
        leftBox.appendChild(span)
        optionParent.appendChild(leftBox)
        
        optionParent.appendChild(createElementWithAttributes('div', {classList : 'text-box', innerText : pollObj['content']}))
        
        currentPollObj.options[pollObj['id']] = {percentageDiv : span, parent : optionParent}
        optionBox.appendChild(optionParent)
    }
    contentBox.appendChild(optionBox)

    parent.appendChild(contentBox)
    
    const bottomBar = createElementWithAttributes('div', {classList : 'bottom-bar'})
    currentPollObj.bottomBar = bottomBar;
    const bottomSpan = createElementWithAttributes('span', {classList : 'total', innerText : `${response['total']} vote(s)`})
    if (response['closed']) { 
        bottomBar.appendChild(createElementWithAttributes('span', {classList : 'state', innerText : 'closed', color : 'red'})) 
    } else { 
        if (isTeacher) {
            const button = createElementWithAttributes('button');
            button.appendChild(createElementWithAttributes('span', {innerText : 'Close Poll'}))
            button.appendChild(createElementWithAttributes('div', {classList : 'spinner'}))
            bottomBar.appendChild(button) 
            currentPollObj.closeButt = button;
            button.onclick = () => {
                if (currentPollObj.state !== 'close-loading') {
                    asyncFunctionForClosingPoll(currentPollObj, response['id'])
                }
            }
        } else {
            bottomBar.appendChild(createElementWithAttributes('span', {classList : 'state', innerText : 'open', color : 'var(--green-color)'})) 
        }
    }
    bottomBar.appendChild(bottomSpan)
    currentPollObj.totalDiv = bottomSpan;

    parent.appendChild(bottomBar)

    listContainer.appendChild(parent)

    if (response['optionDetails'] || response['closed']) {
        setTimeout(() => {
            currentPollObj.addData(response['optionDetails'])
            currentPollObj.state = 'voted';
        }, 100)
    } else {
        currentPollObj.state = 'due';
    }
}

function addDateStampToList(obj) {
    const listContainer = document.querySelector('body > .parent-content > .main-content > .all-messages')

    const parent = createElementWithAttributes('div', {classList : 'datestamp-box'})
    parent.appendChild(createElementWithAttributes('div', {classList : 'content', innerText : obj['date']}))
    listContainer.appendChild(parent)
}

async function asyncFunctionForClosingPoll(pollObj, id) {
    if (confirm("Are you sure you want to close the poll") == true) {
        try {
            pollObj.state = 'close-loading';
            const response = await sendPostRequestForClosingPoll(id);
            pollObj.addData(response['optionDetails'])
            pollObj.totalDiv.innerText = `${response['total']} vote(s)`
            pollObj.replaceCloseButt();
            pollObj.state = 'voted';
        } catch(errMsg) {
            alert(errMsg);
            if (pollObj.closed) { pollObj.state = 'voted'; }
            else { pollObj.state = 'due'; }  
        }
    } 
}

function sendPostRequestForClosingPoll(id) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);
                if (response['success']) {
                    resolve(response)
                } else {
                    reject(response['error_message'])
                }
            }
        }
        
        req.open('POST', `/class/${classIDGlobal}/close-poll/`); 
        const formdata = new FormData();
        formdata.append('id', id)
        req.setRequestHeader("X-CSRFToken", csrftoken); 
        req.send(formdata);
    })
}