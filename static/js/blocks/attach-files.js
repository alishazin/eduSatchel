
var attachFileBlockObj = {};

function onLoadBlock() {
    attachFileBlockObj = {
        parent : document.querySelector('.attach-files-container'),
        navBar : document.querySelector('.attach-files-container > .top-nav-bar'),
        navBarItems : Array.from(document.querySelectorAll('.attach-files-container > .top-nav-bar > .item')),
        separatorInner : document.querySelector('.attach-files-container > .separator > .inner'),
        pageOne : document.querySelector('.attach-files-container > .page-box > .page-one'),
        pageTwo : document.querySelector('.attach-files-container > .page-box > .page-two'),
        _currentSelected : 1,
        get currentSelected() {
            return this._currentSelected;
        },
        set currentSelected(arg) {
            if (arg === 1) {
                this.pageOne.style.display = 'flex';
                this.pageTwo.style.display = 'none';
                this.separatorInner.style.left = '0';
                this.separatorInner.style.width = `${this.navBarItems[0].clientWidth}px`;
                this.navBarItems[0].classList += ' selected';
                this.navBarItems[1].className = 'item';
            } else if (arg === 2) {
                this.pageOne.style.display = 'none';
                this.pageTwo.style.display = 'flex';
                this.separatorInner.style.left = `${this.navBarItems[0].clientWidth}px`;
                this.separatorInner.style.width = `${this.navBarItems[1].clientWidth}px`;
                this.navBarItems[0].className = 'item';
                this.navBarItems[1].classList += ' selected';
            }
            this._currentSelected = arg;
        },
        addCallbacks : function () {
            this.navBarItems[0].onclick = () => {
                this.currentSelected = 1;
            }
            this.navBarItems[1].onclick = () => {
                this.currentSelected = 2;
            }
        },
    }
    attachFileBlockObj.addCallbacks();
    const interval = setInterval(() => {
        console.log(10)
        if (attachFileBlockObj.navBarItems[0].clientWidth !== 0) {
            attachFileBlockObj.currentSelected = 1;
            clearInterval(interval)
        }
    }, 1000)
}