function onLoad() {
    addSelectedToNavBar();
    responsiveMainContent();
    addRandomColorToClassCards();
    cardPopupController();
}

function cardPopupController() {
    const titleContainer = Array.from(document.querySelectorAll('.parent-content > .main-content > .class-box > .title-container'));
    titleContainer.forEach((self) => {
        const popup = self.children[1];
        popup.onwheel = (event) => {
            event.preventDefault();
            popup.scrollLeft += event.deltaY / 3;
        }
        popup.onblur = () => {
            popup.style.display = 'none';
        }
        self.onclick = () => {
            popup.style.display = 'flex';
            popup.focus();
        }
    })
}

function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
    return array
}

function addRandomColorToClassCards() {
    var allColors = ['rgb(255, 104, 104)', 'rgb(68, 196, 255)', 'rgb(255, 196, 0)', 'rgb(74, 255, 201)', 'rgb(173, 111, 255)'];
    const cards = Array.from(document.querySelectorAll('.parent-content > .main-content > .class-box:not(.create-new, .join-new)'));
    let shuffledColors =  shuffleArray(allColors);
    let countColors = shuffledColors.length;
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.backgroundColor = shuffledColors[i % countColors];
        if ((i % countColors) === countColors - 1) {
            shuffledColors = shuffleArray(allColors);
        }
    }
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#home-box').classList += ' selected';
}

function responsiveMainContent() {
    const content = document.querySelector('.parent-content > .main-content');
    const parent = document.querySelector('.parent-content');
    (window.onresize = () => {
        if (document.body.clientWidth > 415) {
            width = Number(parent.clientWidth);
            if (width < 770) {
                content.style.width = '400px';
            } else if (width < 1140) {
                content.style.width = '770px';
            } else if (width < 1510) {
                content.style.width = '1140px';
            } else if (width === 1510) {
                content.style.width = '1510px';
            }
        } else {
            content.style.width = '100%';
        }
    })();
}