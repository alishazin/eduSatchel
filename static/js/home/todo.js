
function onLoad() {
    addSelectedToNavBar();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#todo-box').classList += ' selected';
}

function openURL(url) {
    location.href = url;
}