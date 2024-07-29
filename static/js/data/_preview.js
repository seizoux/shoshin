document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror on the textarea
    const editor = CodeMirror.fromTextArea(document.getElementById('custom-css-input'), {
        mode: 'css',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {
            'Tab': function(cm) {
                cm.replaceSelection('    ', 'end');
            },
            'Ctrl-Space': 'autocomplete'
        }
    });

    // Set the initial height to 10 rows
    editor.setSize(null, '20em');

    document.getElementById('preview-changes-button').addEventListener('click', function() {
        const customCSS = editor.getValue();
        const previewAreaId = 'preview-area';

        // Remove any previous custom styles
        let oldStyleTag = document.getElementById('custom-css-style');
        if (oldStyleTag) {
            oldStyleTag.remove();
        }

        // Create a new style tag with the custom CSS
        const styleTag = document.createElement('style');
        styleTag.id = 'custom-css-style';

        // Wrap user-provided CSS in a scoped CSS block
        styleTag.textContent = `#${previewAreaId} { ${customCSS} }`;

        // Append the new style tag to the head
        document.head.appendChild(styleTag);

        // Apply selected background from localStorage
        const backgroundData = JSON.parse(localStorage.getItem('selectedBackground'));
        if (backgroundData && backgroundData.backgroundImage) {
            document.getElementById(previewAreaId).style.backgroundImage = backgroundData.backgroundImage;
            document.getElementById(previewAreaId).style.backgroundSize = 'cover';
        }

        // Apply selected avatar effect from localStorage
        const avatarEffectData = JSON.parse(localStorage.getItem('selectedAvatarEffect'));
        if (avatarEffectData && avatarEffectData.avatarEffect) {
            const avatarEffectImg = document.getElementById('avatar-effect');
            if (avatarEffectImg) {
                avatarEffectImg.src = avatarEffectData.avatarEffect;
                avatarEffectImg.style.display = 'block';
            }
        }

        // Apply selected color from localStorage
        const selectedColor = localStorage.getItem('selectedColor');
        if (selectedColor) {
            // Add the selected color class
            document.getElementById("shoshin-profile").className = `flex flex-col gap-4 border-green-400 border-2 rounded-md w-full md:w-1/2 mx-auto pb-4 ${selectedColor};`
        }
    });
});