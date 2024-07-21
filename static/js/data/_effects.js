const effectsSelector = document.getElementById('effectsProfileSelector');
const optionsDiv = document.getElementById('effectsProfileOptions');
const arrowIcon = document.getElementById('effectsMenuArrow');

effectsSelector.addEventListener('click', function(event) {
    event.stopPropagation();
    optionsDiv.classList.toggle('hidden');
    arrowIcon.classList.toggle('rotate-180');
});

document.addEventListener('click', function(event) {
    const isClickInside = optionsDiv.contains(event.target) || effectsSelector.contains(event.target);
    if (!isClickInside) {
        optionsDiv.classList.add('hidden');
        arrowIcon.classList.remove('rotate-180');
    }
});

optionsDiv.addEventListener('click', function() {
    optionsDiv.classList.add('hidden');
    arrowIcon.classList.remove('rotate-180');
});