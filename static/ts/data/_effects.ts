import { getCookie } from "../_cookie_manager";
import { _ } from "../auth/_err";

interface Friend {
    avatar: string;
    username: string;
    uid: string;
    bio: string;
}

interface FriendResponse {
    payload: Friend[];
}

interface SearchUser {
    avatar: string;
    username: string;
    bio: string;
    uid: string;
}

interface SearchResponse {
    users: SearchUser[];
}

interface FetchResponse {
    status: string;
    payload: string | boolean;
}

interface CookieResponse {
    [key: string]: any;
}

document.addEventListener('DOMContentLoaded', function() {
    const setupToggle = (selectorId: string, optionsDivId: string, arrowIconId: string, storageKey: string): void => {
        const selector = document.getElementById(selectorId) as HTMLElement;
        const optionsDiv = document.getElementById(optionsDivId) as HTMLElement;
        const arrowIcon = document.getElementById(arrowIconId) as HTMLElement;

        selector.addEventListener('click', function(event) {
            event.stopPropagation();
            optionsDiv.classList.toggle('hidden');
            arrowIcon.classList.toggle('rotate-180');
        });

        document.addEventListener('click', function(event) {
            const target = event.target as HTMLElement;
            const isClickInside = optionsDiv.contains(target) || selector.contains(target);
            if (!isClickInside) {
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');
            }
        });

        optionsDiv.querySelectorAll('.flex').forEach((item) => {
            item.addEventListener('click', () => {
                const selectedText = (this.querySelector('h1') as HTMLElement).textContent || '';
                selector.textContent = selectedText;
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');

                const data = {
                    text: selectedText,
                    backgroundImage: (this.querySelector('.bg-gray-500') as HTMLElement)?.style.backgroundImage || '',
                    avatarEffect: (this.querySelector('img:nth-child(2)') as HTMLImageElement)?.src || ''
                };
                localStorage.setItem(storageKey, JSON.stringify(data));
            });
        });
    }

    setupToggle('backgroundProfileSelector', 'backgroundProfileOptions', 'backgroundMenuArrow', 'selectedBackground');
    setupToggle('effectsProfileSelector', 'effectsProfileOptions', 'effectsMenuArrow', 'selectedAvatarEffect');

    const addFriendsButton = document.getElementById('_sho-sendFriendRequest-button') as HTMLElement;

    const friendButtons = {
        friendList: { func: fetchFriendsList, element: document.getElementById('_sho-currentFriendsButton') as HTMLElement, div: document.getElementById('_sho-acceptedFriendsDiv') as HTMLElement },
        friendRequestsList: { func: fetchFriendRequests, element: document.getElementById('_sho-requestInOutButton') as HTMLElement },
        blockedFriendsList: { func: fetchFriendRequests, element: document.getElementById('_sho-blockedFriendsButton') as HTMLElement }
    };

    async function fetchFriendsList(): Promise<void> {
        let uidCookie = await getCookie('_sho-session');
        if (!uidCookie) {
            _._(1, { data: 'Failed to fetch friends list' }, 'friends');
            return;
        }
        fetch('/api/friends/' + uidCookie.raw.token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'token': uidCookie.raw.token })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch friends list');
        }).then((data: FriendResponse) => {
            friendButtons.friendList.div.innerHTML = '';

            data.payload.forEach(friend => {
                const friendHTML = `
                <div class="flex flex-row items-center gap-4 hover:bg-gray-800/30 p-4 hover:cursor-pointer group">
                    <img src="${friend.avatar || 'https://beta.shoshin.moe/static/default_avatar.png'}" class="w-12 h-12 rounded-full">
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-row gap-2 items-center">
                            <p class="text-gray-300 font-bold text-lg">${friend.username}</p>
                            <p class="text-gray-600 font-semibold text-xs hidden group-hover:block">${friend.uid}</p>
                        </div>
                        <p class="text-gray-400 font-medium text-sm">${friend.bio || '...'}</p>
                    </div>
                    <div class="flex flex-row gap-4 ml-auto">
                        <div class="group/url rounded-full bg-gray-800 relative w-auto items-center flex justify-center px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                            </svg>
                            <p class="text-gray-300 font-medium text-md px-2 py-1 hover:cursor-pointer absolute bottom-8 -translate-y-1/2 hidden group-hover/url:block bg-black/50 rounded-md w-auto text-nowrap">Copy URL</p>
                        </div>
                        <div class="group/remove rounded-full bg-gray-800 relative w-auto items-center flex justify-center px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"/>
                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                            <p class="text-gray-300 font-medium text-md px-2 py-1 hover:cursor-pointer absolute bottom-8 -translate-y-1/2 hidden group-hover/remove:block bg-black/50 rounded-md">Unfriend</p>
                        </div>
                        <div class="group/block rounded-full bg-gray-800 relative w-auto items-center flex justify-center px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-ban" viewBox="0 0 16 16">
                                <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>
                            </svg>
                            <p class="text-gray-300 font-medium text-md px-2 py-1 hover:cursor-pointer absolute bottom-8 -translate-y-1/2 hidden group-hover/block:block bg-black/50 rounded-md">Block</p>
                        </div>
                    </div>
                </div>
                <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700">
                `;

                friendButtons.friendList.div.insertAdjacentHTML('beforeend', friendHTML);
            });
        }).catch(error => {
            console.error(error);
        });
    }

    async function fetchFriendRequests(): Promise<void> {
        let uidCookie = await getCookie('_sho-session');
        if (!uidCookie) {
            _._(1, { data: 'Failed to fetch friends list' }, 'friends');
            return;
        }
        fetch('/api/friends/requests/in-out', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'token': uidCookie.raw.token })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch friend requests');
        }).then((data: FetchResponse) => {
            _._(1, { data: data }, 'friends');
        }).catch(error => {
            console.error(error);
        });
    }

    for (const [, value] of Object.entries(friendButtons)) {
        value.element.addEventListener('click', function() {
            for (const [, value] of Object.entries(friendButtons)) {
                value.element.classList.remove('bg-gray-700/30');
            }
            this.classList.add('bg-gray-700/30');
            value.func();
        });
    }

    const popup = document.getElementById('shoshin-friends-popup') as HTMLElement;
    const addFriendSearch = document.getElementById('_sho-friendSearchInput') as HTMLInputElement;

    addFriendsButton.addEventListener('click', function() {
        popup.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        const target = event.target as HTMLElement;
        if (!popup.contains(target) && target !== addFriendsButton) {
            popup.classList.add('hidden');
        }
    });

    addFriendSearch.addEventListener('keyup', async function(event) {
        if (event.key === 'Enter') {
            const searchQuery = addFriendSearch.value.trim();
            let uidCookie = await getCookie('_sho-session');
            if (!uidCookie) {
                _._(1, { data: 'Failed to fetch friends list' }, 'friends');
                return;
            }

            console.log('Search Query:', searchQuery);

            fetch('/api/friends/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    'search': searchQuery,
                    'token': uidCookie.raw.token
                })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to search for friends');
            }).then((data: SearchResponse) => {
                _._(1, { data: data }, 'friends');
                const searchResults = document.getElementById('shoshin-friends-found') as HTMLElement;
                searchResults.innerHTML = '';

                data.users.forEach(user => {
                    const userHtml = `
                        <div class="flex cursor-pointer items-center gap-4 p-2 hover:bg-gray-300/30 rounded-md">
                            <img src="${user.avatar || 'https://beta.shoshin.moe/static/default_avatar.png'}" class="h-8 w-8 rounded-full" />
                            <div class="flex flex-col">
                                <h1 class="text-gray-300 font-semibold text-lg">${user.username}</h1>
                                <p class="text-white font-light text-xs">${user.bio}</p>
                            </div>
                            <svg id="shoshin-add-friend-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-plus-circle ml-auto hover:bg-orange-500 rounded-full transform transition duration-150" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                            <div id="shoshin-requestSentCheck" class="flex flex-row items-center gap-1 hidden ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="lime" class="bi bi-check2-all" viewBox="0 0 16 16">
                                <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
                                <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                                </svg>
                                <p class="text-green-400 text-lg">Request Sent!</p>
                            </div>
                            <div id="shoshin-requestSentError" class="flex flex-row items-center gap-1 hidden ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L7.293 8z"/>
                                </svg>
                                <p class="text-red-400 text-lg"></p>
                            </div>
                        </div>
                    `;
                    searchResults.insertAdjacentHTML('beforeend', userHtml);

                    const sendFriendRequestIcon = document.getElementById('shoshin-add-friend-icon') as HTMLElement;
                    const requestSentCheck = document.getElementById('shoshin-requestSentCheck') as HTMLElement;
                    const errorMessage = document.getElementById('shoshin-requestSentError') as HTMLElement;

                    sendFriendRequestIcon.addEventListener('click', function() {
                        fetch('/api/friends/request', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                'friend_id': user.uid,
                                'token': uidCookie.raw.token
                            })
                        }).then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error('Failed to send friend request');
                        }).then((data: FetchResponse) => {
                            _._(1, { data: data }, 'friends');

                            if (data.status === 'error') {
                                const errorTextField = errorMessage.querySelector('p') as HTMLElement;
                                errorTextField.textContent = data.payload as string;
                                sendFriendRequestIcon.classList.add('hidden');
                                errorMessage.classList.remove('hidden');
                                return;
                            }

                            sendFriendRequestIcon.classList.add('hidden');
                            requestSentCheck.classList.remove('hidden');
                        }).catch(error => {
                            console.error(error);
                        });
                    });
                });
            }).catch(error => {
                console.error(error);
            });
        }
    });
});