document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const registerForm = document.getElementById('admin-register-form');
    const regEmail = document.getElementById('reg-email');
    const regPassword = document.getElementById('reg-password');
    const regConfirm = document.getElementById('reg-confirm-password');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.style.display = 'none';
        registerSuccess.style.display = 'none';

        const email = regEmail.value.trim();
        const password = regPassword.value.trim();
        const confirmPassword = regConfirm.value.trim();

        // 1. Validate matching passwords
        if (password !== confirmPassword) {
            registerError.textContent = "Error: Passwords do not match.";
            registerError.style.display = 'block';
            return;
        }

        // 2. Create user in Firebase Auth
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive && auth) {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    registerSuccess.style.display = 'block';
                    registerForm.reset();
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = "admin.html";
                    }, 2000);
                })
                .catch((error) => {
                    registerError.textContent = `Firebase Error: ${error.message}`;
                    registerError.style.display = 'block';
                });
        } else {
            registerError.textContent = "Error: Firebase project settings are not connected yet. Set up credentials first.";
            registerError.style.display = 'block';
        }
    });
});
