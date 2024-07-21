const mobileMenuButton = document.getElementById('mobileMenuButton');
const menuSidebar = document.getElementById('menuSidebar');
const overlay = document.getElementById('overlay');

mobileMenuButton.addEventListener('click', function(event) {
    menuSidebar.classList.add('translate-x-0');
    menuSidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
});

overlay.addEventListener('click', function() {
    menuSidebar.classList.add('-translate-x-full');
    menuSidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
});

menuSidebar.addEventListener('click', function() {
    menuSidebar.classList.add('-translate-x-full');
    menuSidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
});