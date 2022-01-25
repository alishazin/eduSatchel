function onLoad() {
    addSelectedToNavBar();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#settings-box').classList += ' selected';
}

function redirect(url) {
    location.href = url;
}