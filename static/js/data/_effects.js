document.addEventListener('DOMContentLoaded', function() {
    // Function to handle toggle logic
    function setupToggle(selectorId, optionsDivId, arrowIconId, storageKey) {
        const selector = document.getElementById(selectorId);
        const optionsDiv = document.getElementById(optionsDivId);
        const arrowIcon = document.getElementById(arrowIconId);

        selector.addEventListener('click', function(event) {
            event.stopPropagation();
            optionsDiv.classList.toggle('hidden');
            arrowIcon.classList.toggle('rotate-180');
        });

        document.addEventListener('click', function(event) {
            const isClickInside = optionsDiv.contains(event.target) || selector.contains(event.target);
            if (!isClickInside) {
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');
            }
        });

        // Add click event listener to each item in the optionsDiv
        optionsDiv.querySelectorAll('.flex').forEach(function(item) {
            item.addEventListener('click', function() {
                const selectedText = this.querySelector('h1').textContent;
                selector.textContent = selectedText;
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');

                // Store the selected option in localStorage
                const data = {
                    text: selectedText,
                    backgroundImage: this.querySelector('.bg-gray-500') ? this.querySelector('.bg-gray-500').style.backgroundImage : '',
                    avatarEffect: this.querySelector('img:nth-child(2)') ? this.querySelector('img:nth-child(2)').src : ''
                };
                localStorage.setItem(storageKey, JSON.stringify(data));
            });
        });
    }

    // Setup for background selector
    setupToggle('backgroundProfileSelector', 'backgroundProfileOptions', 'backgroundMenuArrow', 'selectedBackground');

    // Setup for avatar effects selector
    setupToggle('effectsProfileSelector', 'effectsProfileOptions', 'effectsMenuArrow', 'selectedAvatarEffect');
});