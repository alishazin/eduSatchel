
function onLoad() {
    addSelectedToNavBar();
    addCallbacktoIconBox();
}

function addSelectedToNavBar() {
    document.querySelector('body > .nav-bar > .content-box#todo-box').classList += ' selected';
}

function openURL(url) {
    location.href = url;
}

function addCallbacktoIconBox() {
    Array.from(document.querySelectorAll('.parent-content > .details-container > .timeline-part > .icon-box')).forEach((iconBox) => {
        iconBox.onmouseenter = () => {
            const normalIcon = iconBox.children[0]
            const hoverIcon = iconBox.children[1]

            normalIcon.style.opacity = '0';
            setTimeout(() => {
                normalIcon.style.display = 'none'
                hoverIcon.style.display = 'block'
                setTimeout(() => {
                    hoverIcon.style.opacity = '1'
                    hoverIcon.style.transform = 'translateX(0px)'
                }, 10)
            }, 200)
        }
        iconBox.onmouseleave = () => {
            const normalIcon = iconBox.children[0]
            const hoverIcon = iconBox.children[1]

            hoverIcon.style.transform = 'translateX(5px)'
            hoverIcon.style.opacity = '0'
            setTimeout(() => {
                hoverIcon.style.display = 'none'
                hoverIcon.style.transform = 'translateX(-5px)'
                normalIcon.style.display = 'block'
                setTimeout(() => {
                    normalIcon.style.opacity = '1';
                }, 10)
            }, 200)
        }
    })
}