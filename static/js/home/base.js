function onBaseLoad() {
    addClickToNavBarContentBox();
}

function addClickToNavBarContentBox() {
    document.querySelector('body > .nav-bar > #home-box').onclick = () => {
        location.href = homeURL;
    }
    document.querySelector('body > .nav-bar > #profile-box').onclick = () => {
        location.href = profileURL;
    }
    document.querySelector('body > .nav-bar > #notification-box').onclick = () => {
        location.href = notificationsURL;
    }
    document.querySelector('body > .nav-bar > #settings-box').onclick = () => {
        location.href = settingsURL;
    }
}