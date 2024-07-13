import { RonClick } from './_register.js';
import { onClick } from './_login.js';
import { _ } from './_err.js';

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
        },
        {
            id: '_sho-username-field',
            regex: /^[a-zA-Z0-9_]{3,16}$/,
            checkIconId: '_sho-username-field-checkIcon',
            errorIconId: '_sho-username-field-errorIcon',
            errorMessageId: '_sho-username-field-error',
            errorMessage: 'Username must be between 3 and 16 characters long, and contain only letters, numbers, and underscores.',
            validate_url: 'https://beta.shoshin.moe/api/username/availability'
        }
    ];
    
    fields.forEach(field => {
        let inputField = document.getElementById(field.id);
        let checkIcon = document.getElementById(field.checkIconId);
        let errorIcon = document.getElementById(field.errorIconId);
        let errorMessage = document.getElementById(field.errorMessageId);
    
        if (inputField && checkIcon && errorIcon && errorMessage) {
            inputField.addEventListener('blur', function() {
                let value = inputField.value;
                
                if (field.regex.test(value)) {
                    if (field.validate_url == null) {
                        checkIcon.classList.remove('hidden');
                        errorIcon.classList.add('hidden');
                        errorMessage.classList.add('hidden');
                        inputField.classList.add('border-green-400');
                        inputField.classList.remove('border-red-400');
                    } else {
                        fetch(field.validate_url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ username: value })
                        }).then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error('Failed to validate field');
                        }).then(data => {
                            if (data.result === true) {
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