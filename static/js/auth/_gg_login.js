export function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Handle the response. You can send the token to your backend for verification and user login.
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '1038483240536-89jm7b0oshigganmtrjod1404mu0u62q.apps.googleusercontent.com',
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
};