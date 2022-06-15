
var buttonObject = {};

var addReviewObject = {};

function onLoad() {
    navBarObj.selectItem(1);

    buttonObject = {
        self : document.querySelector('.content-parent button'),
        spinner : document.querySelector('.content-parent button > .spinner'),
        text : document.querySelector('.content-parent button > .span'),
        _state : 'normal',
        get state () {
            return this._state;
        },
        set state(arg) {
            if (arg === 'loading') {
                this.self.classList = 'loading'
            } else if (arg === 'normal') {
                this.self.classList = ''
            }
            this._state = arg;
        }
    };

    addReviewObject = {
        messageField : document.querySelector('.content-parent > .correct-submission > textarea'),
        markField : document.querySelector('.content-parent > .correct-submission > input[type="number"]'), 
        errorDiv : document.querySelector('.content-parent > .correct-submission > .error-div'),
        asyncFuncForCorrection : async function () {
            console.log(1000)
        },
        addCallbacks : function () {
            [this.messageField, this.markField].forEach(field => {
                field.oninput = () => {
                    console.log()
                    if (field.value.trim()) { field.className = 'inputted'; } 
                    else { field.className = ''; }
                }
            })

            buttonObject.self.onclick = () => {
                if (buttonObject.state === 'normal') {
                    this.asyncFuncForCorrection();
                }
            }
        }
    };

    addReviewObject.addCallbacks();
}