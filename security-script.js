// Security Login Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Security script loaded');
    const accessCodeInput = document.getElementById('access-code');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    
    console.log('Elements found:', {
        accessCodeInput: !!accessCodeInput,
        loginBtn: !!loginBtn,
        errorMessage: !!errorMessage
    });
    
    // Password definitions
    const FORM_PASSWORD = '33440';
    
    // Redirect URL
    const FORM_URL = 'grant-program-website.html';
    
    // Handle login button click
    loginBtn.addEventListener('click', function() {
        console.log('Login button clicked');
        const enteredCode = accessCodeInput.value.trim();
        console.log('Entered code:', enteredCode);
        console.log('Expected code:', FORM_PASSWORD);
        
        if (!enteredCode) {
            showError('Please enter an access code');
            return;
        }
        
        // Add loading state
        loginBtn.classList.add('loading');
        loginBtn.innerHTML = '<i class="fas fa-spinner"></i> Verifying Access...';
        
        // Simulate verification delay
        setTimeout(() => {
            if (enteredCode === FORM_PASSWORD) {
                console.log('Access granted, redirecting to:', FORM_URL);
                // Redirect to application form
                showSuccess('Access granted. Redirecting to application...');
                setTimeout(() => {
                    console.log('Attempting redirect to:', FORM_URL);
                    window.location.href = FORM_URL;
                }, 1000);
            } else {
                console.log('Invalid access code');
                // Invalid password
                showError('Invalid access code. Please try again.');
                resetButton();
            }
        }, 800);
    });
    
    // Handle Enter key press
    accessCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // Clear error when user starts typing
    accessCodeInput.addEventListener('input', function() {
        if (errorMessage.classList.contains('show')) {
            hideError();
        }
    });
    
    function showError(message) {
        errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        errorMessage.classList.add('show');
        accessCodeInput.focus();
        accessCodeInput.select();
    }
    
    function hideError() {
        errorMessage.classList.remove('show');
    }
    
    function showSuccess(message) {
        errorMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        errorMessage.classList.remove('show');
        errorMessage.style.color = '#28a745';
        errorMessage.classList.add('show');
        
        // Add success animation to button
        loginBtn.classList.add('success-animation');
        loginBtn.innerHTML = '<i class="fas fa-check"></i> Access Granted';
    }
    
    function resetButton() {
        loginBtn.classList.remove('loading', 'success-animation');
        loginBtn.innerHTML = 'Access Portal';
        loginBtn.style.opacity = '';
    }
    
    // Security: Clear form on page load
    window.addEventListener('beforeunload', function() {
        accessCodeInput.value = '';
    });
    
    // Focus on input when page loads
    accessCodeInput.focus();
    
    // Add some security features
    console.log('Federal Grant Access Portal - Secure Login System');
    
    // Disable right-click context menu for security
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable F12 and other developer tools shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+I (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });
});