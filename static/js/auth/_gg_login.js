import { _f } from './_e.js';

export function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Handle the response. You can send the token to your backend for verification and user login.
}

window.onload = async function () {
    try {
        let _i = await _f('google_client_id');
        google.accounts.id.initialize({
            client_id: _i,
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'pill',
                logo_alignment: 'left'
            }
        );
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
    }
};