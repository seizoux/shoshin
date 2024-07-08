const proxyUrlParts = [104, 116, 116, 112, 115, 58, 47, 47, 115, 104, 111, 115, 104, 105, 110, 46, 109, 111, 101, 47, 99, 97, 112, 116, 99, 104, 97, 47, 103, 111, 111, 103, 108, 101, 47, 114, 101, 99, 97, 112, 116, 99, 104, 97, 47, 118, 101, 114, 105, 102, 121];
const proxyUrl = proxyUrlParts.map(c => String.fromCharCode(c)).join('');

function onClick(e) {
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6LcRawoqAAAAAF9tZG41oi6lOa8JE39h_oKYJtO-', {action: '_sho_LOGIN_RECAPTCHA'});
    console.log(`[ReCaptcha] Analyzing login request for potential bot activity...`);
    new Promise((resolve, reject) => {
        fetch(proxyUrl, {
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
});