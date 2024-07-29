import { _ck } from './auth/_proxy.js';
import { _ } from './auth/_err.js';

const sc = _ck + 'setcookie';
const gc = _ck + 'getcookie';
const ec = _ck + 'erasecookie';

export async function getCookie(name) {
    const response = await fetch(gc + `?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'  // Ensure cookies are included in the request
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Retrieved Cookie!', data);
        return data;
    } else {
        console.error('Failed to retrieve cookie:', data.message);
    }
}

export async function eraseCookie(name) {
    const response = await fetch(ec, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': name,
        },
    });

    const data = await response.json();
    if (response.ok) {
        _._(1, { action: 'Cookie Erased!', cookie: data }, 'cookies');
        return data;
    } else {
        _._(0, { payload: data.message }, 'cookies');
    }
}