
var submissionListManager = {};

function onLoad() {
    navBarObj.selectItem(1);

    submissionListManager = {
        loadingDiv : document.querySelector('.content-parent > .recieved-submission-parent > .submission-list > .loading-div'),
        correctedButton : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .filter-by-box > #text1'),
        notCorrectedButton : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .filter-by-box > #text2'),
        sliderOfButton : document.querySelector('.content-parent > .recieved-submission-parent > .top-long-box > .filter-by-box > .slider'),
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
        addCallbacks : function () {
            this.correctedButton.onclick = () => {
                if (this.loadingState === false && this.sliderState === 'notcorrected') {
                    this.sliderState = 'corrected';
                }
            }
            this.notCorrectedButton.onclick = () => {
                if (this.loadingState === false && this.sliderState === 'corrected') {
                    this.sliderState = 'notcorrected';
                }
            }
        },
        asyncFuncForSubmission : async function () {
            try {
                this.loadingState = true;
                await this.sendGetRequestForSubmission();
                this.loadingState = false;
            } catch(errorObj) {
                if (errorObj['type'] === 'network') {
                    errorObj.call();
                }
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
                        if (response['submissionAvailable'] === true) {
                            resolve();
                        } else {
                            reject(response)
                        }
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
                
                req.open('GET', `/assignment/${classIDGlobal}/${assignmentID}/all-submissions`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send();
            })
        },
    }

    submissionListManager.addCallbacks();
    submissionListManager.asyncFuncForSubmission();
}

