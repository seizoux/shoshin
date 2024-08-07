import { getCookie } from "../_cookie_manager";
import { _ } from "../auth/_err";

document.addEventListener('DOMContentLoaded', function() {
    const setupToggle = (selectorId: string, optionsDivId: string, arrowIconId: string, storageKey: string): void => {
        const selector = document.getElementById(selectorId) as HTMLElement;
        const optionsDiv = document.getElementById(optionsDivId) as HTMLElement;
        const arrowIcon = document.getElementById(arrowIconId) as HTMLElement;

        selector.addEventListener('click', function(event) {
            event.stopPropagation();
            optionsDiv.classList.toggle('hidden');
            arrowIcon.classList.toggle('rotate-180');
        });

        document.addEventListener('click', function(event) {
            const target = event.target as HTMLElement;
            const isClickInside = optionsDiv.contains(target) || selector.contains(target);
            if (!isClickInside) {
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');
            }
        });

        optionsDiv.querySelectorAll('.flex').forEach((item) => {
            item.addEventListener('click', () => {
                const selectedText = (this.querySelector('h1') as HTMLElement).textContent || '';
                selector.textContent = selectedText;
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');

                const data = {
                    text: selectedText,
                    backgroundImage: (this.querySelector('.bg-gray-500') as HTMLElement)?.style.backgroundImage || '',
                    avatarEffect: (this.querySelector('img:nth-child(2)') as HTMLImageElement)?.src || ''
                };
                localStorage.setItem(storageKey, JSON.stringify(data));
            });
        });
    }

    setupToggle('backgroundProfileSelector', 'backgroundProfileOptions', 'backgroundMenuArrow', 'selectedBackground');
    setupToggle('effectsProfileSelector', 'effectsProfileOptions', 'effectsMenuArrow', 'selectedAvatarEffect');
});