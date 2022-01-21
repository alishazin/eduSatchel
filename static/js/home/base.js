function onBaseLoad() {
    // addHoverToNavBarContentBox();
    addClickToNavBarContentBox();
}

function addHoverToNavBarContentBox() {
    const notSelectedBox = Array.from(document.querySelectorAll('body > .nav-bar > .content-box:not(.selected)'));
    notSelectedBox.forEach((self) => {
        const icon = self.children[0];
        const span = self.children[1];
        self.onmouseover = () => {
            if (window.innerWidth > 450) {
                if (self.id === 'notification-box') {
                    span.style.transform = 'translateX(68px)';
                    span.style.opacity = '1';
                } else if (self.id === 'home-box') {
                    span.style.transform = 'translateX(-5px) translateY(-1px)';
                    icon.style.transform = 'translateX(-48px)';
                    span.style.opacity = '1';
                } else if (self.id === 'profile-box') {
                    self.style.flexBasis = '130px';
                    span.style.transform = 'translateX(17px)';
                    icon.style.transform = 'translateX(-30px)';
                    span.style.opacity = '1';
                }
            }
        }
        self.onmouseleave = () => {
            if (window.innerWidth > 450) {
                if (self.id === 'notification-box') {
                    span.style.opacity = '0';
                } else if (self.id === 'home-box') {
                    span.style.opacity = '0';
                    icon.style.transform = 'translateX(0)';
                } else if (self.id === 'profile-box') {
                    self.style.flexBasis = '50px';
                    icon.style.transform = 'translateX(0)';
                    span.style.opacity = '0';
                }
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