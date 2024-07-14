import { _pvc } from './_proxy.js';
import { _ } from './_err.js';
import { setCookie } from '../_cookie_manager.js';

export function _pvc_v(e, c, p, u, us, a) {
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
                username: us,
                action: a
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed.');
        }).then(data => {
            _._(data);
            if (data.status === 'success') {
                _._(200007, { r: 'api/auth', e: data.payload, c: c, p: 'auth'});
                setCookie('uid', data.raw.uid, 1);
                window.location.href = '/account';
            } else if (data.status === 'error') {
                _._(200008, { r: 'api/auth', e: data.payload, c: c, p: 'auth'})
                let errorMessage = document.getElementById('_sho-code-field-error');
                errorMessage.innerText = data.payload;
                errorMessage.classList.remove('hidden');
            }
        }).catch(error => {
            _._(0, { r: 'api/auth', e: error, c: c, p: 'auth'});
            reject();
        });
    })
}
