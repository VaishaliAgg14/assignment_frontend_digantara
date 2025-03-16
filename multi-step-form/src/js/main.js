class MultiStepForm {
    constructor() {
        this.form = document.getElementById('multiStepForm');
        this.steps = Array.from(document.querySelectorAll('.form-step'));
        this.nextBtns = document.querySelectorAll('.next-btn');
        this.backBtns = document.querySelectorAll('.back-btn');
        this.progressSteps = document.querySelectorAll('.step');
        this.currentStep = 1;
        this.formData = this.loadFromLocalStorage() || {};

        this.init();
    }

    init() {
        this.loadSavedData();

        this.nextBtns.forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        this.backBtns.forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
                this.saveToLocalStorage();
            });
        });
    }

    loadSavedData() {
        if (Object.keys(this.formData).length > 0) {
            Object.keys(this.formData).forEach(key => {
                const input = this.form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = this.formData[key];
                }
            });
        }
    }

    validateField(field) {
        let isValid = true;
        const errorElement = field.nextElementSibling;

        errorElement.textContent = '';
        field.classList.remove('invalid');

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorElement.textContent = 'This field is required';
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorElement.textContent = 'Please enter a valid email address';
            }
        }

        if (field.name === 'phone' && field.value) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorElement.textContent = 'Please enter a valid 10-digit phone number';
            }
        }

        if (!isValid) {
            field.classList.add('invalid');
        }

        return isValid;
    }

    validateStep(step) {
        const fields = step.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    nextStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        
        if (!this.validateStep(currentStepElement)) {
            return;
        }

        this.updateFormData();
        
        if (this.currentStep < this.steps.length) {
            this.currentStep++;
            this.updateUI();
            if (this.currentStep === 3) {
                this.updateSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    updateUI() {
        this.steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === this.currentStep) {
                step.classList.add('active');
            }
        });

        this.progressSteps.forEach((step, idx) => {
            if (idx < this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updateFormData() {
        const formInputs = this.form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            this.formData[input.name] = input.value;
        });
        this.saveToLocalStorage();
    }

    updateSummary() {
        const summaryDiv = document.getElementById('summary');
        summaryDiv.innerHTML = `
            <div class="summary-item">
                <h3>Basic Details</h3>
                <p><strong>Name:</strong> ${this.formData.name}</p>
                <p><strong>Date of Birth:</strong> ${this.formData.dob}</p>
                <p><strong>Gender:</strong> ${this.formData.gender}</p>
            </div>
            <div class="summary-item">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> ${this.formData.email}</p>
                <p><strong>Phone:</strong> ${this.formData.phone}</p>
                <p><strong>Address:</strong> ${this.formData.address}</p>
            </div>
        `;
    }

    saveToLocalStorage() {
        localStorage.setItem('formData', JSON.stringify(this.formData));
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('formData');
        return savedData ? JSON.parse(savedData) : null;
    }

    handleSubmit(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to submit the form?')) {
            console.log('Form submitted:', this.formData);
            localStorage.removeItem('formData');
            alert('Form submitted successfully!');
            this.form.reset();
            this.currentStep = 1;
            this.updateUI();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm();
});