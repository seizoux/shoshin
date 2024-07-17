import { getCookie, eraseCookie } from '../_cookie_manager.js';
import { _ } from '../auth/_err.js';
import { _pv } from '../auth/_proxy.js'

document.addEventListener('DOMContentLoaded', function() {
    let _a = {
        "_sho-mng-details": "_sho-mng-div-details",
        "_sho-mng-security": "_sho-mng-div-security",
        "_sho-mng-general": "_sho-mng-div-general",
        "_sho-mng-achievements": "_sho-mng-div-achievements",
        "_sho-mng-appearance": "_sho-mng-div-appearance",
        "_sho-mng-followers": "_sho-mng-div-followers",
        "_sho-mng-favourites": "_sho-mng-div-favourites",
        "_sho-mng-subscriptions": "_sho-mng-div-subscriptions",
        "_sho-mng-linked": "_sho-mng-div-linked",
        "_sho-mng-logout": "_sho-mng-div-logout"
    };

    let _cfe = {
        "_sho-mng-details": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-security": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-general": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-achievements": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-appearance": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-followers": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-favourites": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-subscriptions": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-yellow-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-yellow-300",
        "_sho-mng-linked": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-orange-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-orange-300",
        "_sho-mng-logout": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal bg-red-500/50 rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border border-red-300"
    };

    let _cfe_b = {
        "_sho-mng-details": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-security": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-general": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-achievements": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-appearance": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-followers": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-favourites": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-subscriptions": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-yellow-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-yellow-300",
        "_sho-mng-linked": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-orange-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-orange-300",
        "_sho-mng-logout": "p-3 ml-2 flex flex-row gap-2 items-center text-white text-base font-normal hover:bg-red-500/30 hover:rounded-l-full hover:underline decoration-dotted underline-offset-4 hover:cursor-pointer hover:border hover:border-red-300"
    };

    for (let buttonId in _a) {
        let button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {

                button.className = _cfe[buttonId];

                // Update all other buttons with the default class if they don't have it
                for (let otherButtonId in _a) {
                    if (otherButtonId !== buttonId) {
                        let otherButton = document.getElementById(otherButtonId);
                        if (otherButton && otherButton.className !== _cfe_b[otherButtonId]) {
                            otherButton.className = _cfe_b[otherButtonId];
                        }
                    }
                }

                // Show the associated element and hide all others
                for (let divId in _a) {
                    let div = document.getElementById(_a[divId]);
                    if (div) {
                        if (divId === buttonId) {
                            div.classList.remove('hidden');
                        } else {
                            div.classList.add('hidden');
                        }
                    }
                }
            });
        }
    }

    // Hide all divs and show only the _sho-mng-details one
    for (let divId in _a) {
        let div = document.getElementById(_a[divId]);
        if (div) {
            if (divId === "_sho-mng-details") {
                div.classList.remove('hidden');
            } else {
                div.classList.add('hidden');
            }
        }
    }

    // Apply the active class to _sho-mng-details button
    let detailsButton = document.getElementById("_sho-mng-details");
    if (detailsButton) {
        detailsButton.className = _cfe["_sho-mng-details"];
    }

    const email = document.getElementById('_sho-mng-email-field').value;
    const maskedEmail = maskEmail(email);
    document.getElementById('_sho-mng-email-field').value = maskedEmail;

    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const menuItems = dropdownMenu.querySelectorAll('.flex.flex-col.gap-1.px-4.py-2');
    
    menuButton.addEventListener('click', function(event) {
        dropdownMenu.classList.toggle('hidden');
    });
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const selectedText = item.querySelector('a').textContent;
            menuButton.innerHTML = `${selectedText} <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
            dropdownMenu.classList.add('hidden');
        });
    });
    
    document.addEventListener('click', function(event) {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Get the browser cookie named 'uid'
    let uidCookie = getCookie('_sho-session');

    // If the cookie exists, parse it and check its expiration
    if (uidCookie) {
        let uidData = JSON.parse(uidCookie);
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
            }
            ).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to verify session');
            }).then(data => {
                if (data === true) {
                    _._(200011, { r: 'api/auth', e: data.payload, p: 'auth'});
                } else if (data === false) {
                    _._(200012, { r: 'api/auth', e: data.payload, p: 'auth'});
                    console.error(error);
                    eraseCookie('_sho-session');
                    //window.location.href = '/login';
                }
            }).catch(error => {
                console.error(error);
                eraseCookie('_sho-session');
                //window.location.href = '/login';
            });
        }
    } else {
        window.location.href = '/login';
    }
});

function maskEmail(email) {
    const [name, domain] = email.split("@");
    if (name.length <= 2) {
      return email; // Too short to mask, return as is
    }
    const maskedName = name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    return maskedName + "@" + domain;
  }