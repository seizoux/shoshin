export function onClick(e) {
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6LcRawoqAAAAAF9tZG41oi6lOa8JE39h_oKYJtO-', {action: '_sho_LOGIN_RECAPTCHA'});
    console.log(`[ReCaptcha] Analyzing login request for potential bot activity...`);
    new Promise((resolve, reject) => {
        fetch(_px, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                token: token,
                action: '_sho_LOGIN_RECAPTCHA'
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to login');
        }).then(data => {
            console.log(data);
            if (data.status === 'success') {
                console.log(`[ReCaptcha] Login request is not a bot.`);
                resolve();

                var loginButton = document.getElementById('_sho-login');
                if (loginButton) {
                    // Display a loading indicator instead of the login button text while the login request is being processed. made with tailwind css
                    loginButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120.709 5.291L19.3 3.883A10.001 10.001 0 004.117 18.117l1.407-1.408z"></path></svg>Processing...';
                }

                var email = document.getElementById('_sho-email-field').value;
                var password = document.getElementById('_sho-password-field').value;

                new Promise((resolve, reject) => {
                    fetch(_pl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                            action: "login"
                        })
                    }).then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Failed to login');
                    }).then(data => {
                        console.log(data);
                        if (data.status === 'success') {
                            console.log(`[Auth] Login successful.`);
                            window.location.href = '/account';
                        } else if (data.status === 'error') {
                            console.log(`[Auth] Login failed: ${data.message}`);
                            loginButton.innerHTML = 'Login';
                            
                            let errorBanner = document.getElementById('_sho-login-errorBannerTop');
                            
                            // Remove the 'hidden' class to display the element
                            errorBanner.classList.remove('hidden');
                    
                            // Trigger reflow to enable transition
                            void errorBanner.offsetWidth;
                    
                            // Add the class to trigger the slide-down animation
                            errorBanner.classList.remove('-translate-y-full');
                            errorBanner.classList.add('translate-y-0');

                            let errorBannerClose = document.getElementById('_sho-login-errorBannerTop-close');
                            if (errorBannerClose) {
                                errorBannerClose.addEventListener('click', function() {
                                    let errorBanner = document.getElementById('_sho-login-errorBannerTop');
                                    
                                    // Add the class to trigger the slide-up animation
                                    errorBanner.classList.add('-translate-y-full');
                                    
                                    // Hide the element after the animation is complete
                                    setTimeout(() => {
                                        errorBanner.classList.add('hidden');
                                    }, 250);
                                });
                            }
                        }
                    }).catch(error => {
                        console.error(error);
                        reject();
                    });
                });
            }
        }).catch(error => {
            console.error(error);
            reject();
        });
    });
});
}