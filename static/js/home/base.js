function onBaseLoad() {
    // addHoverToNavBarContentBox();
    addClickToNavBarContentBox();
}

// function addHoverToNavBarContentBox() {
//     const notSelectedBox = Array.from(document.querySelector('body > .nav-bar > .content-box:not(.selected)'));
//     notSelectedBox.forEach((self) => {
//         const icon = self.children[0];
//         const span = self.children[1];
//         self.onmouseover = () => {
//             if (self.id === 'profile-box') {
//                 span.style.transform = 'translateX(48px)';
//                 span.style.opacity = '1';
//             } else if (self.id === 'notification-box') {
//                 span.style.transform = 'translateX(-5px) translateY(-1px)';
//                 icon.style.transform = 'translateX(-48px)';
//                 span.style.opacity = '1';
//             }
//         }
//         self.onmouseleave = () => {
//             if (self.id === 'notification-box') {
//                 span.style.opacity = '0';
//             } else if (self.id === 'home-box') {
//                 span.style.opacity = '0';
//                 icon.style.transform = 'translateX(0)';
//             }
//         }
//     })
// }
function addHoverToNavBarContentBox() {
    const notSelectedBox = Array.from(document.querySelector('body > .nav-bar > .content-box:not(.selected)'));
    notSelectedBox.forEach((self) => {
        const icon = self.children[0];
        const span = self.children[1];
        self.onmouseover = () => {
            if (self.id === 'profile-box') {
                span.style.transform = 'translateX(48px)';
                span.style.opacity = '1';
            } else if (self.id === 'notification-box') {
                span.style.transform = 'translateX(-5px) translateY(-1px)';
                icon.style.transform = 'translateX(-48px)';
                span.style.opacity = '1';
            }
        }
        self.onmouseleave = () => {
            if (self.id === 'notification-box') {
                span.style.opacity = '0';
            } else if (self.id === 'home-box') {
                span.style.opacity = '0';
                icon.style.transform = 'translateX(0)';
            }
        }
    })
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
}