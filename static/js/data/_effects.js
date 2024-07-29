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
    const friendsButton = document.getElementById('_sho-sendFriendRequest-button');
    const popup = document.getElementById('shoshin-friends-popup');
    const friendSearch = document.getElementById('_sho-friendSearchInput');

    // Toggle popup visibility when the button is clicked
    friendsButton.addEventListener('click', function() {
        popup.classList.toggle('hidden');
    });

    // Hide popup when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target) && event.target !== friendsButton) {
            popup.classList.add('hidden');
        }
    });

    // Search functionality, used to search for new friends and add them
    friendSearch.addEventListener('keyup', async function(event) {
        // Check if the key pressed is "ENTER"
        if (event.key === 'Enter') {
            const searchQuery = friendSearch.value.trim(); // Keep the value as a string
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