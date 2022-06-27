
var carouselObject = {};

var tableObject = {};

function onLoad() {
    navBarObj.selectItem(1);

    carouselObject = {
        parent : {
            div : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .carousel-parent'),
            pos : 0,
        },
        self : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .carousel-parent > .carousel'),
        arrowLeft : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .arrow.left'),
        arrowRight : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .arrow.right'),
        itemOne : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .carousel-parent > .carousel > .item#one'),
        itemTwo : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .carousel-parent > .carousel > .item#two'),
        itemThree : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .carousel-parent > .carousel > .item#three'),
        itemFour : document.querySelector('.content-parent > .bottom-area > .sort-by-container > .carousel-container > .carousel-parent > .carousel > .item#four'),
        _selected : null,
        get selected() {
            return this._selected;
        },
        set selected(arg) {
            (async function () {
                const allItems = [[carouselObject.itemOne, 1, 0], [carouselObject.itemTwo, 2, 140], [carouselObject.itemThree, 3, 330], [carouselObject.itemFour, 4, 469]]
                for (let x of allItems) {
                    if (x[1] === arg) {
                        x[0].classList = 'item selected';
                        carouselObject.loadingState = true;
                        await carouselObject.animateScroll(carouselObject.parent.div, x[2])
                        carouselObject.loadingState = false;

                        await tableObject.reArrangeListItems(arg);
                    } else {
                        x[0].classList = 'item';
                    }
                }
                carouselObject._selected = arg;
                if (carouselObject.selected === 1) { carouselObject.arrowLeft.classList = 'arrow left loading' }
                if (carouselObject.selected === 4) { carouselObject.arrowRight.classList = 'arrow right loading' }
            })();
        },
        loadingState : false,
        animateScroll : function (element, scrollTo) {
            return new Promise((resolve) => {
                let gap = (scrollTo - this.parent.pos) / 35;
                if (gap < 0) {
                    gap = gap * -1;
                }
                let count = 0;
                const intervalObj = setInterval(() => {
                    if (scrollTo > this.parent.pos) {this.parent.pos += gap;} 
                    else {this.parent.pos -= gap;}
    
                    element.scrollLeft = this.parent.pos;
                    if (count == 35) {
                        this.parent.pos = scrollTo;
                        element.scrollLeft = scrollTo;
                        clearInterval(intervalObj);
                        resolve();
                        // order does not matter
                    }
                    count++;
                }, 10)

            })
        },
        addCallbacks : function () {
            this.arrowLeft.onclick = () => {
                if (this.selected !== 1 && this.loadingState === false) {
                    this.selected = this.selected - 1
                    this.arrowRight.classList = 'arrow right'
                }
            }
            this.arrowRight.onclick = () => {
                if (this.selected !== 4 && this.loadingState === false) {
                    this.selected = this.selected + 1
                    this.arrowLeft.classList = 'arrow left'
                }
            }
        }
    }

    tableObject = {
        table : document.querySelector('.content-parent > .bottom-area > .table-container > .table'),
        emptyDiv : document.querySelector('.content-parent > .bottom-area > .table-container > .table > .empty-div'),
        loadingObj : {
            div : document.querySelector('.content-parent > .bottom-area > .table-container > .table > .loading-parent'),
            allData : [],
            _loadingState : false,
            get loadingState() {
                return this._loadingState;
            },
            set loadingState(arg) {
                if (arg === true) {
                    this.div.style.display = 'block'
                    this.div.classList = 'loading-parent loading'
                } else if (arg === false) {
                    this.div.classList = 'loading-parent'
                    this.div.style.display = 'none'
                }
                this._loadingState = arg;
            } 
        },
        asyncFuncForData : async function () {
            try {
                this.loadingObj.loadingState = true;
                carouselObject.loadingState = true;
                this.allData = await this.sendGetRequestForData();
                this.loadingObj.loadingState = false;
                carouselObject.loadingState = false;
                
                if (this.allData.length === 0) {
                    this.emptyDiv.style.display = 'flex'
                } else {
                    carouselObject.selected = 1;
                }
            } catch(err) {
                err.call()
            }
        },
        sendGetRequestForData : function () {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        const response = JSON.parse(this.responseText);
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
                
                req.open('GET', `/assignment/${classIDGlobal}/${assignmentID}/correct/more-details/get-data/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send();
            })
        },
        reArrangeListItems : function (sortBy) {
            return new Promise((resolve, reject) => {
                this.removeAllListItem()
                sortedList = this.getSortedList(sortBy)
    
                for (let x of sortedList) {
                    const tableItem = createElementWithAttributes('div', {classList : 'table-item'})
    
                    const name = createElementWithAttributes('div', {classList : 'name', innerText : x[0]})
                    tableItem.appendChild(name)
                    
                    const submitted = createElementWithAttributes('div', {classList : 'submitted bool'})
                    if (x[1]) { submitted.appendChild(createElementWithAttributes('i', {classList : 'bi bi-check-circle', color : 'var(--green-color)'})) }
                    else { submitted.appendChild(createElementWithAttributes('i', {classList : 'bi bi-x-circle', color : 'var(--tertiary-color)'})) }
                    tableItem.appendChild(submitted)
    
                    const subDate = createElementWithAttributes('div', {classList : 'sub-date', innerText : this.convertArrayToString(x[2])})
                    tableItem.appendChild(subDate)
                    
                    const corrected = createElementWithAttributes('div', {classList : 'corrected bool'})
                    if (x[3]) { corrected.appendChild(createElementWithAttributes('i', {classList : 'bi bi-check-circle', color : 'var(--green-color)'})) }
                    else { corrected.appendChild(createElementWithAttributes('i', {classList : 'bi bi-x-circle', color : 'var(--tertiary-color)'})) }
                    tableItem.appendChild(corrected)
    
                    const corDate = createElementWithAttributes('div', {classList : 'cor-date', innerText : this.convertArrayToString(x[4])})
                    tableItem.appendChild(corDate)
    
                    const onTime = createElementWithAttributes('div', {classList : 'ontime bool'})
                    if (x[5]) { onTime.appendChild(createElementWithAttributes('i', {classList : 'bi bi-check-circle', color : 'var(--green-color)'})) }
                    else { onTime.appendChild(createElementWithAttributes('i', {classList : 'bi bi-x-circle', color : 'var(--tertiary-color)'})) }
                    tableItem.appendChild(onTime)
    
                    const mark = createElementWithAttributes('div', {classList : 'mark bool', innerText : x[6]})
                    tableItem.appendChild(mark)

                    if (x[7] != '') {
                        tableItem.classList = 'table-item redirect'
                        tableItem.onclick = () => {
                            location.href = `${currentHref}/${x[7]}/`
                        }
                    } else {
                        tableItem.onclick = () => {
                            document.querySelector('.content-parent > .popup-div').classList = 'popup-div show'
                            setTimeout(() => {
                                document.querySelector('.content-parent > .popup-div').classList = 'popup-div'
                            }, 1800)
                        }
                    }
                    
                    this.table.appendChild(tableItem)
                }
                
                resolve()
            })
        },
        convertArrayToString : function (dateArray) {
            if (dateArray.length === 0) { return '' }
            else {
                if (dateArray[3] > 12) {
                    var hour = dateArray[3] - 12
                    var meridian = 'PM'
                } else {
                    var hour = dateArray[3]
                    var meridian = 'AM'
                }

                return `${dateArray[0]}/${dateArray[1]}/${String(dateArray[2]).slice(2)} ${hour}:${dateArray[4]} ${meridian}`;
            }
        },
        conertArrayToDate : function (dateArray) {
            if (dateArray.length === 0) { return '' }
            else {
                const dateObj = new Date(
                    Number(dateArray[2]),
                    Number(dateArray[1]),
                    Number(dateArray[0]),
                    Number(dateArray[3]),
                    Number(dateArray[4]),
                )

                return dateObj;
            }
        },
        getSortedList : function (sortBy) {
            returnList = this.allData.slice();
            if (sortBy === 1) {
                // Sort By Name
                for (let i = 0; i < returnList.length; i++) {
                    key = returnList[i]
                    j = i - 1

                    while (j >= 0 && key[0] < returnList[j][0]) {
                        returnList[j + 1] = returnList[j]
                        j -= 1
                    }

                    returnList[j + 1] = key
                }
            } else if (sortBy === 2) {
                // Sort by Submission Date
                for (let i = 0; i < returnList.length; i++) {
                    key = returnList[i]
                    j = i - 1

                    while (j >= 0 && this.conertArrayToDate(key[2]) > this.conertArrayToDate(returnList[j][2])) {
                        returnList[j + 1] = returnList[j]
                        j -= 1
                    }

                    returnList[j + 1] = key
                }
            } else if (sortBy === 3) {
                // Sort by Correction Date
                for (let i = 0; i < returnList.length; i++) {
                    key = returnList[i]
                    j = i - 1

                    while (j >= 0 && this.conertArrayToDate(key[4]) > this.conertArrayToDate(returnList[j][4])) {
                        returnList[j + 1] = returnList[j]
                        j -= 1
                    }

                    returnList[j + 1] = key
                }
            } else if (sortBy === 4) {
                // Sort By Mark
                for (let i = 0; i < returnList.length; i++) {
                    key = returnList[i]
                    j = i - 1

                    while (j >= 0 && key[6] > returnList[j][6]) {
                        returnList[j + 1] = returnList[j]
                        j -= 1
                    }

                    returnList[j + 1] = key
                }
            }

            return returnList;
        },
        removeAllListItem : function () {
            Array.from(document.querySelectorAll('.content-parent > .bottom-area > .table-container > .table > .table-item')).forEach((e) => {
                e.remove()
            })
        }
    }

    carouselObject.addCallbacks();
    tableObject.asyncFuncForData();
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