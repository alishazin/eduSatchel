function onLoad() {
    addSelectedToNavBar();
    responsiveMainContent();
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