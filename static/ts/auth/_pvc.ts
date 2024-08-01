import { _pvc } from './_proxy';
import { _ } from './_err';

interface FetchResponse {
    status: string;
    payload: any;
}

export function _pvc_v(
    e: string,
    c: string,
    p: string,
    u: string | null,
    us: string | null,
    a: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        fetch(_pvc, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e,
                code: c,
                passw: p,
                uid: u,
                username: us,
                action: a
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed.');
        }).then((data: FetchResponse) => {
            _._(1, { data: data });
            if (data.status === 'success') {
                _._(200007, { r: 'api/auth', e: data.payload, c: c, p: 'auth' });
                window.location.href = '/profile/manage';
            } else if (data.status === 'error') {
                _._(200008, { r: 'api/auth', e: data.payload, c: c, p: 'auth' });
                const errorMessage = document.getElementById('_sho-code-field-error') as HTMLElement;
                errorMessage.innerText = data.payload;
                errorMessage.classList.remove('hidden');
            }
        }).catch(error => {
            _._(0, { r: 'api/auth', e: error, c: c, p: 'auth' });
            reject();
        });
    });
}