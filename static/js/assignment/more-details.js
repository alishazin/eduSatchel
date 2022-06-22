
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
                    setTimeout(() => {
                        this.div.classList = 'loading-parent loading'
                    }, 100)
                } else if (arg === false) {
                    this.div.classList = 'loading-parent'
                    setTimeout(() => {
                        this.div.style.display = 'none'
                    }, 500)
                }
                this._loadingState = arg;
            } 
        },
        asyncFuncForData : async function () {
            this.loadingObj.loadingState = true;
            carouselObject.loadingState = true;
            this.allData = await this.sendGetRequestForData();
            this.loadingObj.loadingState = false;
            carouselObject.loadingState = false;

            this.reArrangeListItems(3);
        },
        sendGetRequestForData : function () {
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
                
                req.open('GET', `/assignment/${classIDGlobal}/${assignmentID}/correct/more-details/get-data/`); 
                req.setRequestHeader("X-CSRFToken", csrftoken); 
                req.send();
            })
        },
        reArrangeListItems : function (sortBy) {
            this.removeAllListItem()
            sortedList = this.getSortedList(sortBy)
            console.log(sortedList)
        },
        conertArrayToDate : function (dateArray) {
            if (dateArray === []) { return '' }
            else {
                const dateObj = new Date(
                    Number(dateArray[2]),
                    Number(dateArray[1]),
                    Number(dateArray[0]),
                    Number(dateArray[3]),
                    Number(dateArray[4]),
                )

                console.log(dateObj)
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

                    while (j >= 0 && this.conertArrayToDate(key[2]) < this.conertArrayToDate(returnList[j][2])) {
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

                    while (j >= 0 && this.conertArrayToDate(key[4]) < this.conertArrayToDate(returnList[j][4])) {
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
    carouselObject.selected = 1;

    setTimeout(() => {
        tableObject.asyncFuncForData();
    }, 360)
}