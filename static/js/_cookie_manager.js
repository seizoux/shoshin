export function setCookie(name, value_id, value_us, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    // Create a JSON object to store both the value and the expiration time
    const cookieValue = JSON.stringify({ raw: {uid: value_id, username: value_us, expiry: date.getTime() }});

    document.cookie = name + "=" + cookieValue + ";" + expires + ";path=/";
}

export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

export function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}