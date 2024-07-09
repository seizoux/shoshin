const part1 = [104, 116, 116, 112, 115, 58, 47, 47, 98, 101];
const part2 = [116, 97, 46, 115, 104, 111, 115, 104, 105, 110];
const part3 = [46, 109, 111, 101, 47, 99, 97, 112, 116, 99];
const part4 = [104, 97, 47, 103, 111, 111, 103, 108, 101, 47];
const part5 = [114, 101, 99, 97, 112, 116, 99, 104, 97, 47, 118, 101, 114, 105, 102, 121];
const asciiCodes = part1.concat(part2, part3, part4, part5);
const _px = asciiCodes.map(code => String.fromCharCode(code)).join('');

const _La_part1 = [104, 116, 116, 112, 115, 58, 47, 47, 98, 101];
const _La_part2 = [116, 97, 46, 115, 104, 111, 115, 104, 105, 110];
const _La_part3 = [46, 109, 111, 101, 47, 97, 117, 116, 104, 47];
const _La_part4 = [108, 111, 103, 105, 110];
const _La_asciiCodes = _La_part1.concat(_La_part2, _La_part3, _La_part4);
const _pl = _La_asciiCodes.map(code => String.fromCharCode(code)).join('');

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

                var loginButton = document.getElementById('_sho-login');
                if (loginButton) {
                    // Display a loading indicator instead of the login button text while the login request is being processed. made with tailwind css
                    loginButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120.709 5.291L19.3 3.883A10.001 10.001 0 004.117 18.117l1.407-1.408z"></path></svg>Processing...';
                }

                var email = document.getElementById('_sho-email-field').value;
                var password = document.getElementById('_sho-password-field').value;

                new Promise((resolve, reject) => {
                    fetch(_pl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }).then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Failed to login');
                    }).then(data => {
                        console.log(data);
                        if (data.status === 'success') {
                            console.log(`[Auth] Login successful.`);
                            window.location.href = '/account';
                        } else if (data.status === 'error') {
                            console.log(`[Auth] Login failed: ${data.message}`);
                            loginButton.innerHTML = 'Login';
                            
                            let errorBanner = document.getElementById('_sho-login-errorBannerTop');
                            
                            // Remove the 'hidden' class to display the element
                            errorBanner.classList.remove('hidden');
                    
                            // Trigger reflow to enable transition
                            void errorBanner.offsetWidth;
                    
                            // Add the class to trigger the slide-down animation
                            errorBanner.classList.remove('-translate-y-full');
                            errorBanner.classList.add('translate-y-0');

                            let errorBannerClose = document.getElementById('_sho-login-errorBannerTop-close');
                            if (errorBannerClose) {
                                errorBannerClose.addEventListener('click', function() {
                                    let errorBanner = document.getElementById('_sho-login-errorBannerTop');
                                    
                                    // Add the class to trigger the slide-up animation
                                    errorBanner.classList.add('-translate-y-full');
                                    
                                    // Hide the element after the animation is complete
                                    setTimeout(() => {
                                        errorBanner.classList.add('hidden');
                                    }, 250);
                                });
                            }
                        }
                    }).catch(error => {
                        console.error(error);
                        reject();
                    });
                });
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