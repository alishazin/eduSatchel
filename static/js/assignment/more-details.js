
var carouselObject = {};

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

    carouselObject.addCallbacks();
    carouselObject.selected = 1;
}