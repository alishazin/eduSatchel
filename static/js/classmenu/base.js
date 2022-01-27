function onBaseLoad() {
    addEventToBaseBackButton();
}

function addEventToBaseBackButton() {
    const but = document.querySelector('body > .back-box > .back-button');
    but.onclick = () => {
        location.href = homeURL;
    }
}