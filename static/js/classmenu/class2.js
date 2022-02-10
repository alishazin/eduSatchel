
var allMessagesDiv = {};

function onLoadSecondFile() {
    allMessagesDiv = {
        parent : document.querySelector('body > .parent-content > .main-content > .all-messages'),
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
        dataLoadStep : 1,
    }
    allMessagesDiv.state = 'loading';
} 