import { getCookie, eraseCookie } from '../_cookie_manager';
import { _ } from '../auth/_err';
import { _pv } from '../auth/_proxy';
import { UidData, FetchResponse } from '../interfaces';

`
document.addEventListener('DOMContentLoaded', async function() {
    // Get the browser cookie named 'uid'
    let uidData = await getCookie('_sho-session');

    // If the cookie exists, parse it and check its expiration
    if (uidData) {
        _._(1, { data: uidData }, 'auth');
        let currentTime = new Date().getTime();

        if (currentTime > uidData.expiry) {
            // If the cookie is expired, remove it and redirect the user to the login page
            eraseCookie('_sho-session');
            window.location.href = '/login';
        } else {
            // If the cookie is not expired, redirect the user to the account page
            fetch(_pv, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ token: uidData.raw.token, just_verify: true, action: 'check' }) 
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to verify session');
            }).then((data: FetchResponse) => {
                if (data.payload === true) {
                    _._(200011, { r: 'api/auth', e: data.payload, p: 'auth'});
                } else if (data.payload === false) {
                    _._(200012, { r: 'api/auth', e: data.payload, p: 'auth'});
                    eraseCookie('_sho-session');
                    window.location.href = '/login';
                }
            }).catch(error => {
                console.error(error);
                eraseCookie('_sho-session');
                window.location.href = '/login';
            });
        }
    } else {
        window.location.href = '/login';
    }
});
`