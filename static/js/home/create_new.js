function onLoad() {
    addSelectedToNavBar();
    addClickEventToCustomCheckBox();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#home-box').classList += ' selected';
}

function addClickEventToCustomCheckBox() {
    const realhiddenCheckBox = document.querySelector('.parent-content > .sub-container > form > #id_state');
    const checkboxParent = document.querySelector('.parent-content > .sub-container > form > .checkbox-custom-container > .checkbox');
    const icon = document.querySelector('.parent-content > .sub-container > form > .checkbox-custom-container > .checkbox > i');
    checkboxParent.onclick = () => {
        if (realhiddenCheckBox.checked == false) {
            realhiddenCheckBox.checked = true;
            checkboxParent.classList += ' checked'
            icon.style.display = 'inline';
        } else {
            realhiddenCheckBox.checked = false;
            checkboxParent.classList = 'checkbox'
            icon.style.display = 'none';
        }
        console.log(realhiddenCheckBox.checked);
    }
}