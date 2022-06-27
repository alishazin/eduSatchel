function onLoad() {
    animateProgressLine();
}

function animateProgressLine() {
    const colorLine = document.querySelector('.parent > .progress-container > .line > .color-line');
    const ballOne = document.querySelector('.parent > .progress-container > .line > #one');
    const ballTwo = document.querySelector('.parent > .progress-container > .line > #two');
    // setting ballOne to check without transition
    colorLine.style.transition = 'none';
    colorLine.style.width = '25%';
    ballOne.innerHTML = '<i class="bi bi-check"></i>';
    ballOne.style.backgroundColor = 'var(--green-color)';  
    colorLine.style.transition = 'width 1.5s';
    // setting ballTwo to check with transition
    setTimeout(() => {
        colorLine.style.width = '50%';
        setTimeout(() => {
            ballTwo.innerHTML = '<i class="bi bi-check"></i>';
            ballTwo.style.backgroundColor = 'var(--green-color)';  
        }, 1050);
    }, 200);
}