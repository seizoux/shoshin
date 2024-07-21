const backgroundSelector = document.getElementById('backgroundProfileSelector');
const optionsDiv = document.getElementById('backgroundProfileOptions');
const arrowIcon = document.getElementById('backgroundMenuArrow');

backgroundSelector.addEventListener('click', function(event) {
    event.stopPropagation();
    optionsDiv.classList.toggle('hidden');
    arrowIcon.classList.toggle('rotate-180');
});

document.addEventListener('click', function(event) {
    const isClickInside = optionsDiv.contains(event.target) || backgroundSelector.contains(event.target);
    if (!isClickInside) {
        optionsDiv.classList.add('hidden');
        arrowIcon.classList.remove('rotate-180');
    }
});

optionsDiv.addEventListener('click', function() {
    optionsDiv.classList.add('hidden');
    arrowIcon.classList.remove('rotate-180');
});