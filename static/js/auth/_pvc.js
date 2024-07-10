import { _pvc } from './_proxy.js';

export function _pvc_v(e, c, p, u) {
    new Promise((resolve, reject) => {
        fetch(_pvc, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e,
                code: c,
                pass: p,
                uid: u,
                action: "verify"
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to verify email');
        }).then(data => {
            console.log(data);
            if (data.status === 'success') {
                console.log(`[Auth] Email Verification successful.`);
                window.location.href = '/account';
            } else if (data.status === 'error') {
                console.log(`[Auth] Email Verification failed: ${data.payload}`);
                let errorMessage = document.getElementById('_sho-code-field-error');
                errorMessage.innerText = data.payload;
                errorMessage.classList.remove('hidden');
            }
        }).catch(error => {
            console.error(error);
            reject();
        });
    })
}
