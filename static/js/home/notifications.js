function onLoad() {
    addSelectedToNavBar();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#notification-box').classList += ' selected';
}