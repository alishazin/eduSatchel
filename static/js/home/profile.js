function onLoad() {
    addSelectedToNavBar();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#profile-box').classList += ' selected';
}