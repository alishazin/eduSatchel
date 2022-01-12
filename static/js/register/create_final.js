function onLoad() {
    animateProgressLine();
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