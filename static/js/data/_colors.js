document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('[data-color]').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});