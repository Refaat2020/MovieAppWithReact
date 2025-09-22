document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const inputs = document.querySelectorAll('input');
    const actionBtn = document.querySelector('.login-btn');
    
    // Add ripple effect to inputs
    inputs.forEach(input => {
        input.addEventListener('focus', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.parentNode.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            setTimeout(() => ripple.remove(), 1000);
        });
    });

    // Button animation when the mouse is over it gets a little bit higher and bigger
    if (actionBtn) {
        actionBtn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        actionBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Common validation functions for email and password the language is set to be the same as your browser i hope, see if it works on your computer well
    const validateEmail = (email) => {
        if (!email.value) {
            email.setAttribute('title', 'Please enter your email address');
            email.pattern = '.*';
            email.setCustomValidity('Please enter your email address');
            email.reportValidity();
            return false;
        } else if (!email.value.includes('@')) {
            email.setAttribute('title', 'Please include an "@" in the email address');
            email.pattern = '.*@.*';
            email.setCustomValidity('Please include an "@" in the email address');
            email.reportValidity();
            return false;
        }
        return true;
    };

    const validatePassword = (password) => {
        if (!password.value) {
            password.setAttribute('title', 'Please enter your password');
            password.setCustomValidity('Please enter your password');
            password.reportValidity();
            return false;
        }
        return true;
    };

    // Login form handling if the form is submitted the validation will be done we have to add the rest when we have the backend
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            
            email.setAttribute('oninvalid', 'this.setCustomValidity("")');
            email.setAttribute('oninput', 'this.setCustomValidity("")');
            if (!validateEmail(email)) return;

            password.setAttribute('oninvalid', 'this.setCustomValidity("")');
            password.setAttribute('oninput', 'this.setCustomValidity("")');
            if (!validatePassword(password)) return;
            
            // Add loading animation to button
            actionBtn.innerHTML = 'Loading...';
            actionBtn.disabled = true;
            
            setTimeout(() => {
                actionBtn.innerHTML = 'Log in';
                actionBtn.disabled = false;
            }, 2000);
        });
    }

    // Signup form handling is the same as the login form but we have to add the rest when we have the backend
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');

            // Name validation
            if (!name.value) {
                name.setCustomValidity('Please enter your full name');
                name.reportValidity();
                return;
            }

            // Email validation
            email.setAttribute('oninvalid', 'this.setCustomValidity("")');
            email.setAttribute('oninput', 'this.setCustomValidity("")');
            if (!validateEmail(email)) return;

            // Password validation
            password.setAttribute('oninvalid', 'this.setCustomValidity("")');
            password.setAttribute('oninput', 'this.setCustomValidity("")');
            if (!validatePassword(password)) return;

            if (password.value.length < 6) {
                password.setCustomValidity('Password must be at least 6 characters long');
                password.reportValidity();
                return;
            }

            // Confirm password validation
            if (!confirmPassword.value) {
                confirmPassword.setCustomValidity('Please confirm your password');
                confirmPassword.reportValidity();
                return;
            } else if (confirmPassword.value !== password.value) {
                confirmPassword.setCustomValidity('Passwords do not match');
                confirmPassword.reportValidity();
                return;
            }
            
            // Add loading animation to button it just so the user knows that the form is being submitted if we see that it not necessary we can remove it
            actionBtn.innerHTML = 'Loading...';
            actionBtn.disabled = true;
            
            setTimeout(() => {
                actionBtn.innerHTML = 'Sign Up';
                actionBtn.disabled = false;
            }, 2000);
        });
    }

    // Clear validation messages when user starts typing, it just so the user knows that the input is valid
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
});