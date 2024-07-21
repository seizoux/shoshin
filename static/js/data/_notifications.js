const menuButton = document.getElementById('menu-button');
const dropdownMenu = document.getElementById('dropdownMenu');
const menuItems = dropdownMenu.querySelectorAll('.flex.flex-col.gap-1.px-4.py-2');

menuButton.addEventListener('click', function(event) {
    dropdownMenu.classList.toggle('hidden');
});

menuItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedText = item.querySelector('a').textContent;
        menuButton.innerHTML = `${selectedText} <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
        dropdownMenu.classList.add('hidden');
    });
});

document.addEventListener('click', function(event) {
    if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
    }
});