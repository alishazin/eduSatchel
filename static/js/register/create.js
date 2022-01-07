function onLoad() {
    addClickEventToButtonBG();
}

function addClickEventToButtonBG() {
    const but1 = document.querySelector('.card-box > .button-box > #teacher');
    const but2 = document.querySelector('.card-box > .button-box > #student');
    but1.onclick = () => {
        location.href = teacherRedirect;
    }
    but2.onclick = () => {
        location.href = studentRedirect;
    }
}