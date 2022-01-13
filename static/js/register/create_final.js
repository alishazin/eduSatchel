function onLoadTeacher() {
    animateProgressLine();
    addEventToProfilePic();
    addEventToRemovePic();
    addClickEventToField();
}

function onLoadStudent() {
    animateProgressLine();
    addEventToProfilePic();
    addEventToRemovePic();
}

function animateProgressLine() {
    const colorLine = document.querySelector('.parent > .progress-container > .line > .color-line');
    const ballOne = document.querySelector('.parent > .progress-container > .line > #one');
    const ballTwo = document.querySelector('.parent > .progress-container > .line > #two');
    const ballThree = document.querySelector('.parent > .progress-container > .line > #three');
    // setting ballOne and ballTwo to check without transition
    colorLine.style.transition = 'none';
    colorLine.style.width = '50%';
    ballOne.innerHTML = '<i class="bi bi-check"></i>';
    ballOne.style.backgroundColor = 'var(--green-color)';  
    ballTwo.innerHTML = '<i class="bi bi-check"></i>';
    ballTwo.style.backgroundColor = 'var(--green-color)';  
    colorLine.style.transition = 'width 1.5s';
    // setting ballThree to check with transition
    setTimeout(() => {
        colorLine.style.width = '75%';
        setTimeout(() => {
            ballThree.innerHTML = '<i class="bi bi-check"></i>';
            ballThree.style.backgroundColor = 'var(--green-color)';  
        }, 1050);
    }, 200);
}

function addClickEventToField() {
    const inputField = document.querySelector('.parent > form > .field-parent > textarea');
    const onFocusFunc = function () {
        const label = inputField.parentElement.children[1];
        label.style.top = '-8px';
        label.style.fontSize = '13px';
    };
    // made asynchronous for giving chrome time to add former value
    setTimeout(() => {
        if (inputField.value.length > 0) {
            onFocusFunc();
        }
    }, 100) 
    inputField.onfocus = onFocusFunc;
    inputField.onblur = () => {
        if (inputField.value.length === 0) {
            const label = inputField.parentElement.children[1];
            label.style.top = '12.7px';
            label.style.fontSize = '15px';
        }
    }
}

function addEventToProfilePic() {
    const inputImg = document.querySelector(".parent > form > .profile-container > input[type='file']");
    const overlay = document.querySelector(".parent > form > .profile-container > .image-container > .check-overlay");
    inputImg.onchange = (e) => {
        overlay.style.opacity = '1';
    }
}

function addEventToRemovePic() {
    const butt = document.querySelector(".parent > form > .profile-container > .remove-butt");
    const inputImg = document.querySelector(".parent > form > .profile-container > input[type='file']");
    const overlay = document.querySelector(".parent > form > .profile-container > .image-container > .check-overlay");
    butt.onclick = () => {
        overlay.style.opacity = '0';
        inputImg.value = null;
    }
}