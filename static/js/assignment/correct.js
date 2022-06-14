
var submissionListManager = {};

function onLoad() {
    navBarObj.selectItem(1);

    submissionListManager = {
        loadingDiv : document.querySelector('.content-parent > .recieved-submission-parent > .submission-list > .loading-div'),
        correctedButton : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .filter-by-box > #text1'),
        notCorrectedButton : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .filter-by-box > #text2'),
        totalSubmissionTextDiv : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .text'),
        emptySubmissionDiv : document.querySelector('.content-parent > .recieved-submission-parent > .submission-list > .empty-submission'),
        sliderOfButton : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .filter-by-box > .slider'),
        submissionListDiv : document.querySelector('.content-parent > .recieved-submission-parent > .submission-list'),
        _loadingState : true,
        get loadingState() {
            return this._loadingState;
        },
        set loadingState(arg) {
            if (arg === true) {
                this.loadingDiv.style.display = 'block';
            } else if (arg === false) {
                this.loadingDiv.style.display = 'none';
            }
            this._loadingState = arg;
        },
        _sliderState : 'corrected',
        get sliderState() {
            return this._sliderState;
        },
        set sliderState(arg) {
            if (arg === 'corrected') {
                this.correctedButton.classList = 'text selected'; 
                this.notCorrectedButton.classList = 'text';       
                this.sliderOfButton.style.width = '45%';      
                this.sliderOfButton.style.left = '0%'; 
            } else if (arg === 'notcorrected') {
                this.notCorrectedButton.classList = 'text selected';       
                this.correctedButton.classList = 'text';       
                this.sliderOfButton.style.width = '55%';      
                this.sliderOfButton.style.left = '45%'; 
            }
            this._sliderState = arg;
        },
        _listItemState : 'corrected',
        get listItemState() {
            return this._listItemState;
        },
        set listItemState(arg) {
            this.clearListItems();
            if (arg === 'corrected') {key = arg;} 
            else if (arg === 'notcorrected') {key = 'not-corrected';}

            if (this.submissionDataObject[key].length == 0) {
                this.emptySubmissionDiv.style.display = 'flex';
            } else {
                for (let x of this.submissionDataObject[key]) {
                    const listItem = createElementWithAttributes('div', {classList : 'list-item'})
    
                    const name = createElementWithAttributes('div', {classList : 'name', innerText : x[0]})
    
                    const onTime = createElementWithAttributes('div', {classList : 'on-time'})
                    if (x[1]) { onTime.appendChild(createElementWithAttributes('i', {classList : 'bi bi-check-circle-fill', color : 'var(--green-color)'})) }
                    else { onTime.appendChild(createElementWithAttributes('i', {classList : 'bi bi-x-circle-fill', color : 'var(--tertiary-color)'})) }
                    
                    const hoverIcon = createElementWithAttributes('div', {classList : 'hover-icon'})
                    hoverIcon.appendChild(createElementWithAttributes('i', {classList : 'bi bi-chevron-double-right'}))
    
                    listItem.appendChild(name)
                    listItem.appendChild(onTime)
                    listItem.appendChild(hoverIcon)

                    listItem.onclick = () => {
                        location.href = `${currentHref}/${x[2]}/`
                    }
                    
                    this.submissionListDiv.appendChild(listItem)
                }
            }
            this._listItemState = arg;
        },
        submissionDataObject : null,
        clearListItems : function () {
            Array.from(document.querySelectorAll('.content-parent > .recieved-submission-parent > .submission-list > .list-item')).forEach(element => {
                element.remove();
            })
            this.emptySubmissionDiv.style.display = 'none'
        },
        addCallbacks : function (empty) {
            this.correctedButton.onclick = () => {
                if (this.loadingState === false && this.sliderState === 'notcorrected') {
                    this.sliderState = 'corrected';
                    if (!empty) { this.listItemState = 'corrected'; }
                }
            }
            this.notCorrectedButton.onclick = () => {
                if (this.loadingState === false && this.sliderState === 'corrected') {
                    this.sliderState = 'notcorrected';
                    if (!empty) { this.listItemState = 'notcorrected'; }
                }
            }
        },
        asyncFuncForSubmission : async function () {
            try {
                this.loadingState = true;
                this.submissionDataObject = await this.sendGetRequestForSubmission();
                this.listItemState = 'notcorrected';
                this.sliderState = 'notcorrected';
                this.loadingState = false;
            } catch(errorObj) {
                errorObj.call();
                this.loadingState = false;
            }
        },
        sendGetRequestForSubmission : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        console.log(response)
                        resolve(response);
                    }
                }

                req.onerror = () => {
                    reject({
                        call : () => {
                            alert("No Active Network Connection")
                        }
                    });
                }
                
                req.open('GET', `/assignment/${classIDGlobal}/${assignmentID}/all-submissions`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send();
            })
        },
    }

    submissionListManager.totalSubmissionTextDiv.innerText = `${totalSubmissions} Submission(s)`

    if (totalSubmissions != 0) {
        submissionListManager.addCallbacks();
        submissionListManager.asyncFuncForSubmission();
    } else {
        submissionListManager.addCallbacks(true);
        submissionListManager.loadingState = false;
        submissionListManager.emptySubmissionDiv.style.display = 'flex';
    }
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