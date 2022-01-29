function onLoad() {
    addSelectedToNavBar();
    addFocusEventToInput();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#home-box').classList += ' selected';
}

function addFocusEventToInput() {
    input = document.querySelector('.parent-content > .sub-container > form > .field-parent > input')

    input.onfocus = () => {
        input.parentElement.children[0].style.color = 'var(--quaternary-color)';
    }
    input.onblur = () => {
        input.parentElement.children[0].style.color = 'white';
    }
}