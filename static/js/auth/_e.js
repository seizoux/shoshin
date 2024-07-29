import { _pe } from './_proxy.js';
import { _ } from './_err.js';

export async function _f(c) {
    try {
        const r = await fetch(_pe, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: c })
        });
        const d = await r.json();
        return d.key;
    } catch (error) {
        _._(200006, { r: 'api/env', e: error, c: c, p: 'auth'});
    }
}

