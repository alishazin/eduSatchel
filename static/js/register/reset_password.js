function onLoad() {
    addClickEventToField();
}

function addClickEventToField() {
    const inputField = Array.from(document.querySelectorAll('.parent > form > .field-parent > input'));
    inputField.forEach((field) => {
        // calling it at the start if contains value and adding it as onfocus callback
        const onFocusFunc = function () {
            const label = field.parentElement.children[1];
            label.style.top = '-8px';
            label.style.fontSize = '13px';
        };
        // made asynchronous for giving chrome time to add former value
        setTimeout(() => {
            if (field.value.length > 0) {
                onFocusFunc();
            }
        }, 100) 
        field.onfocus = onFocusFunc;
        field.onblur = () => {
            if (field.value.length === 0) {
                const label = field.parentElement.children[1];
                label.style.top = '12.7px';
                label.style.fontSize = '14px';
            }
        }
    })
}