function onBaseLoad() {
    addHoverToNavBarContentBox();
    addClickToNavBarContentBox();
}

function addHoverToNavBarContentBox() {
    const notSelectedBox = document.querySelector('body > .nav-bar > .content-box:not(.selected)');
    const icon = document.querySelector('body > .nav-bar > .content-box:not(.selected) > i');
    const span = document.querySelector('body > .nav-bar > .content-box:not(.selected) > span');
    notSelectedBox.onmouseover = () => {
        if (notSelectedBox.id === 'profile-box') {
            span.style.transform = 'translateX(48px)';
            span.style.opacity = '1';
        } else {
            span.style.transform = 'translateX(-5px) translateY(-1px)';
            icon.style.transform = 'translateX(-48px)';
            span.style.opacity = '1';
        }
    }
    notSelectedBox.onmouseleave = () => {
        if (notSelectedBox.id === 'profile-box') {
            span.style.opacity = '0';
        } else {
            span.style.opacity = '0';
            icon.style.transform = 'translateX(0)';
        }
    }
}

function addClickToNavBarContentBox() {
    document.querySelector('body > .nav-bar > #home-box').onclick = () => {
        location.href = homeURL;
    }
    document.querySelector('body > .nav-bar > #profile-box').onclick = () => {
        location.href = profileURL;
    }
}