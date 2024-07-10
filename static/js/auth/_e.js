import { _pe } from './_proxy.js';

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
        console.error('Error fetching environment variables:', error);
    }
}

