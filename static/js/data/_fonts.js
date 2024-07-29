document.getElementById('custom-select-button').addEventListener('click', function() {
    document.getElementById('custom-select-options').classList.toggle('hidden');
});

document.querySelectorAll('#custom-select-options li').forEach(function(item) {
    item.addEventListener('click', function() {
        document.getElementById('custom-select-button').textContent = this.textContent;
        document.getElementById('custom-select-options').classList.add('hidden');
    });
});

document.addEventListener('click', function(event) {
    var isClickInside = document.getElementById('custom-select-button').contains(event.target);
    var isOptionClickInside = document.getElementById('custom-select-options').contains(event.target);

    if (!isClickInside && !isOptionClickInside) {
        document.getElementById('custom-select-options').classList.add('hidden');
    }
});