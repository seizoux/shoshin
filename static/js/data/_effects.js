import { getCookie } from "../_cookie_manager.js";
import { _ } from "../auth/_err.js";

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle toggle logic
    function setupToggle(selectorId, optionsDivId, arrowIconId, storageKey) {
        const selector = document.getElementById(selectorId);
        const optionsDiv = document.getElementById(optionsDivId);
        const arrowIcon = document.getElementById(arrowIconId);

        selector.addEventListener('click', function(event) {
            event.stopPropagation();
            optionsDiv.classList.toggle('hidden');
            arrowIcon.classList.toggle('rotate-180');
        });

        document.addEventListener('click', function(event) {
            const isClickInside = optionsDiv.contains(event.target) || selector.contains(event.target);
            if (!isClickInside) {
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');
            }
        });

        // Add click event listener to each item in the optionsDiv
        optionsDiv.querySelectorAll('.flex').forEach(function(item) {
            item.addEventListener('click', function() {
                const selectedText = this.querySelector('h1').textContent;
                selector.textContent = selectedText;
                optionsDiv.classList.add('hidden');
                arrowIcon.classList.remove('rotate-180');

                // Store the selected option in localStorage
                const data = {
                    text: selectedText,
                    backgroundImage: this.querySelector('.bg-gray-500') ? this.querySelector('.bg-gray-500').style.backgroundImage : '',
                    avatarEffect: this.querySelector('img:nth-child(2)') ? this.querySelector('img:nth-child(2)').src : ''
                };
                localStorage.setItem(storageKey, JSON.stringify(data));
            });
        });
    }

    // Setup for background selector
    setupToggle('backgroundProfileSelector', 'backgroundProfileOptions', 'backgroundMenuArrow', 'selectedBackground');

    // Setup for avatar effects selector
    setupToggle('effectsProfileSelector', 'effectsProfileOptions', 'effectsMenuArrow', 'selectedAvatarEffect');

    // Friends Handling
    const addFriendsButton = document.getElementById('_sho-sendFriendRequest-button');

    const friendButtons = {
        friendList: { func: fetchFriendsList, element: document.getElementById('_sho-currentFriendsButton'), div: document.getElementById('_sho-acceptedFriendsDiv') },
        friendRequestsList: { func: fetchFriendRequests, element: document.getElementById('_sho-requestInOutButton') },
        blockedFriendsList: { func: fetchFriendRequests, element: document.getElementById('_sho-blockedFriendsButton') }
    }

    // Fetch the user's friends list
    async function fetchFriendsList() {
        let uidCookie = await getCookie('_sho-session');
        fetch('/api/friends/' + uidCookie.raw.token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'token': uidCookie.raw.token })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch friends list');
        }).then(data => {
            // Clear the previous friends list
            friendButtons.friendList.div.innerHTML = '';
            
            // Add the friends list to the friends list container getting all the elements inside data.payload
            for (const friend of data.payload) {
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
                `

                // Append the new friend to the friends list
                friendButtons.friendList.div.insertAdjacentHTML('beforeend', friendHTML);
            }
        }).catch(error => {
            console.error(error);
        });
    };

    async function fetchFriendRequests() {
        let uidCookie = await getCookie('_sho-session');
        fetch('/api/friends/requests/in-out', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'token': uidCookie.raw.token })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch friend requests');
        }).then(data => {
            // Log the response data for debugging
            _._(1, { data: data }, 'friends');
        }).catch(error => {
            console.error(error);
        });
    };

    // Add click event listeners to each button in the friendButtons array (which is structed like name: {function: function_name, element: document.getEelementById()}) and apply the class "bg-gray-700/30"
    for (const [key, value] of Object.entries(friendButtons)) {
        value.element.addEventListener('click', function() {
            for (const [key, value] of Object.entries(friendButtons)) {
                value.element.classList.remove('bg-gray-700/30');
            }
            this.classList.add('bg-gray-700/30');
            value.func();
        });
    }

    const popup = document.getElementById('shoshin-friends-popup');
    const addFriendSearch = document.getElementById('_sho-friendSearchInput');

    // Toggle popup visibility when the button is clicked
    addFriendsButton.addEventListener('click', function() {
        popup.classList.toggle('hidden');
    });

    // Hide popup when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target) && event.target !== addFriendsButton) {
            popup.classList.add('hidden');
        }
    });

    // Search functionality, used to search for new friends and add them
    addFriendSearch.addEventListener('keyup', async function(event) {
        // Check if the key pressed is "ENTER"
        if (event.key === 'Enter') {
            const searchQuery = addFriendSearch.value.trim(); // Keep the value as a string
            let uidCookie = await getCookie('_sho-session');

            console.log('Search Query:', searchQuery); // Log the search query for debugging

            // POST request to the server to search for friends
            fetch('/api/friends/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    'search': searchQuery, // Send the search query as a string
                    'token': uidCookie.raw.token
                })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to search for friends');
            }).then(data => {
                // Clear the previous search results (if any) and display the new results from data.users, which is an array of user objects
                _._(1, { data: data }, 'friends');
                const searchResults = document.getElementById('shoshin-friends-found');
                searchResults.innerHTML = ''; // Clear the previous search results

                // Loop through each user object in the data.users array
                data.users.forEach(user => {
                    // Create the HTML structure using template literals
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
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                                <p class="text-red-400 text-lg"></p>
                            </div>
                        </div>
                    `;
                    // Append the created HTML to the search results
                    searchResults.insertAdjacentHTML('beforeend', userHtml);

                    const sendFriendRequestIcon = document.getElementById('shoshin-add-friend-icon');
                    const requestSentCheck = document.getElementById('shoshin-requestSentCheck');
                    const errorMessage = document.getElementById('shoshin-requestSentError');

                    sendFriendRequestIcon.addEventListener('click', function() {
                        // POST request to the server to add the user as a friend
                        fetch('/api/friends/request', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                'friend_id': user.uid, // Send the username of the user to add as a friend
                                'token': uidCookie.raw.token
                            })
                        }).then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error('Failed to send friend request');
                        }).then(data => {
                            // Log the response data for debugging
                            _._(1, { data: data }, 'friends');

                            if (data.status === 'error') {
                                const errorTextField = errorMessage.querySelector('p');
                                errorTextField.textContent = data.payload;
                                sendFriendRequestIcon.classList.add('hidden');
                                errorMessage.classList.remove('hidden');
                                return;
                            }

                            // Display a success message to the user
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