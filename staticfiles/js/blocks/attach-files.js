
var attachFileBlockObj = {};

function onLoadBlock(errorDiv) {
    attachFileBlockObj = {
        parent : document.querySelector('.attach-files-container'),
        navBar : document.querySelector('.attach-files-container > .top-nav-bar'),
        navBarItems : Array.from(document.querySelectorAll('.attach-files-container > .top-nav-bar > .item')),
        separatorInner : document.querySelector('.attach-files-container > .separator > .inner'),
        pageOne : document.querySelector('.attach-files-container > .page-box > .page-one'),
        fileLabel : document.querySelector('.attach-files-container > .page-box > .page-one > .new-file > label'),
        hiddenInputs : document.querySelector('.attach-files-container > .page-box > .page-one > .input-hidden-area'),
        pageTwo : document.querySelector('.attach-files-container > .page-box > .page-two'),
        urlInput : document.querySelector('.attach-files-container > .page-box > .page-two > .new-url > input'),
        addUrlButt : document.querySelector('.attach-files-container > .page-box > .page-two > .new-url > .add-butt'),
        addedUrls : {},
        urlCount : 0,
        fileCount : 1,
        errorMsgSpace : errorDiv,
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
        onChangeFileFunction : function (input) {
            this.errorMsgSpace.innerText = '';
            this.fileCount++;
    
            // Visible Things
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-div';
            const idDiv = document.createElement('div');
            idDiv.className = 'hidden-id';
            idDiv.innerText = `${this.fileCount - 1}`;
            fileDiv.appendChild(idDiv);
            const span = document.createElement('span');
            span.innerText = input.files[0].name;
            fileDiv.appendChild(span);
            const closeButt = document.createElement('i');
            closeButt.classList = 'bi bi-x';
            closeButt.onclick = () => {
                const parent = closeButt.parentElement;
                const idCount = parent.children[0].innerText;
                parent.remove();
                this.hiddenInputs.querySelector(`:scope > #file-${idCount}-id`).remove();
            }
            fileDiv.appendChild(closeButt);
            this.pageOne.appendChild(fileDiv);
    
            // Hidden Things
            const newInput = document.createElement('input');
            newInput.onchange = () => {
                this.onChangeFileFunction(newInput);
            };
            newInput.type = 'file';
            newInput.name = `file-${this.fileCount}`;
            newInput.id = `file-${this.fileCount}-id`;
    
            this.fileLabel.htmlFor = `file-${this.fileCount}-id`;
            this.hiddenInputs.appendChild(newInput);    

        },
        resetAll : function () {
            // Resetting Files
            Array.from(document.querySelectorAll('.attach-files-container > .page-box > .page-one > .file-div')).forEach(div => {
                div.remove();
            })
            Array.from(this.hiddenInputs.children).forEach(child => {
                child.remove();
            })
            const newInput = document.createElement('input');
            newInput.type = 'file';
            newInput.name = 'file-1';
            newInput.id = 'file-1-id';
            newInput.onchange = () => {
                this.onChangeFileFunction(newInput);
            }
            this.hiddenInputs.appendChild(newInput);
            this.fileCount = 1;
            this.fileLabel.htmlFor = 'file-1-id';

            // Resetting Urls
            Array.from(document.querySelectorAll('.attach-files-container > .page-box > .page-two > .url-box')).forEach(child => {
                child.remove();
            })
            this.urlCount = 0;
            this.addedUrls = {};

            this.errorMsgSpace.innerText = '';
            this.urlInput.value = '';
        },
        onClickAddUrl : function () {
            const value = this.urlInput.value.trim()
            if (value.length !== 0 && this.isValidUrl(value)) {
                this.urlCount++;
    
                // Visible Things
                const urlDiv = document.createElement('div');
                urlDiv.className = 'url-box';
                const idDiv = document.createElement('div');
                idDiv.className = 'hidden-id';
                idDiv.innerText = `${this.urlCount}`;
                urlDiv.appendChild(idDiv);
                const span = document.createElement('span');
                span.innerText = value;
                urlDiv.appendChild(span);
                const closeButt = document.createElement('i');
                closeButt.classList = 'bi bi-x';
                closeButt.onclick = () => {
                    const parent = closeButt.parentElement;
                    const idCount = parent.children[0].innerText;
                    parent.remove();
                    delete this.addedUrls[idCount];
                }
                urlDiv.appendChild(closeButt);
                this.pageTwo.appendChild(urlDiv);
    
                // Hidden Things
                this.addedUrls[this.urlCount] = value;
            }
            else {
                this.errorMsgSpace.innerText = 'Invalid URL';
            }
            this.urlInput.value = '';
        },
        isValidUrl : function (string) {
            let url;
            try {
              url = new URL(string);
            } catch (_) {
              return false;  
            }
            this.errorMsgSpace.innerText = '';
            return true;
        },
        getData : function () {
            this.errorMsgSpace.innerText = '';
            let returnObj = {
                files : {},
                urls : {},
            };
            let fileCountLocal = 0;
            let urlCountLocal = 0;
            Array.from(this.hiddenInputs.children).forEach((input) => {
                let data = input.files[0];
                if (data) {
                    fileCountLocal++;
                    returnObj.files[fileCountLocal] = data;
                }
            })
            for (let x in this.addedUrls) {
                urlCountLocal++;
                returnObj.urls[urlCountLocal] = this.addedUrls[x];
            }
            return returnObj;
        },
        addCallbacks : function () {
            this.navBarItems[0].onclick = () => {
                this.currentSelected = 1;
            }
            this.navBarItems[1].onclick = () => {
                this.currentSelected = 2;
            }
            Array.from(this.hiddenInputs.children).forEach(input => {
                input.onchange = () => {
                    this.onChangeFileFunction(input);
                };
            })
            this.pageOne.onwheel = (event) => {
                event.preventDefault();
                this.pageOne.scrollLeft += event.deltaY / 3;
            }
            this.pageTwo.onwheel = (event) => {
                event.preventDefault();
                this.pageTwo.scrollLeft += event.deltaY / 3;
            }
            this.addUrlButt.onclick = () => {
                this.onClickAddUrl();
            };
            this.urlInput.onkeydown = event => {
                if (event.keyCode == 13) {
                    this.onClickAddUrl();
                }
            }
        },
    }
    attachFileBlockObj.addCallbacks();
    const interval = setInterval(() => {
        if (attachFileBlockObj.navBarItems[0].clientWidth !== 0) {
            attachFileBlockObj.currentSelected = 1;
            clearInterval(interval)
        }
    }, 100)
}