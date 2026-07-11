// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Load saved Web3Forms key if available
    const savedKey = localStorage.getItem('kd_web3forms_key');
    const keyInput = document.getElementById('web3forms-key');
    if (keyInput) {
        keyInput.value = savedKey || 'cf9f261c-6bd7-4cf0-8282-599c01c52a34';
    }
    
    // Save key to localStorage when updated
    if (keyInput) {
        keyInput.addEventListener('input', (e) => {
            localStorage.setItem('kd_web3forms_key', e.target.value.trim());
        });
    }
});

// Mobile Navbar Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active Navigation link highlighting on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 120)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

// Mouse Radial Glow Hover Effect for Service Cards
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

// Interactive Project Planner Multi-Step Form Logic
let currentStep = 1;
const totalSteps = 3;

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnSubmit = document.getElementById('btn-submit');
const form = document.getElementById('project-planner-form');
const successScreen = document.getElementById('success-screen');
const btnResetForm = document.getElementById('btn-reset-form');

// Update budget slider live display
const budgetSlider = document.getElementById('budget-slider');
const budgetDisplay = document.getElementById('budget-display');

budgetSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    if (value >= 30000) {
        budgetDisplay.textContent = '₹30,000+';
    } else {
        budgetDisplay.textContent = `₹${value.toLocaleString('en-IN')}`;
    }
});

// Step Navigation Handler
function showStep(step) {
    // Hide all steps
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    
    // Show correct step
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update navigation buttons visibility & text
    if (step === 1) {
        btnBack.style.visibility = 'hidden';
        btnNext.style.display = 'block';
        btnSubmit.style.display = 'none';
    } else if (step === totalSteps) {
        btnBack.style.visibility = 'visible';
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'block';
    } else {
        btnBack.style.visibility = 'visible';
        btnNext.style.display = 'block';
        btnSubmit.style.display = 'none';
    }
    
    updateProgressBar(step);
}

function updateProgressBar(step) {
    const progressLine = document.getElementById('progress-line');
    const steps = document.querySelectorAll('.progress-step');
    
    // Calculate progress line width: step 1 -> 0%, step 2 -> 50%, step 3 -> 100%
    const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = `${progressPercent}%`;
    
    // Update classes on circles
    steps.forEach(circle => {
        const circleStep = parseInt(circle.getAttribute('data-step'));
        if (circleStep < step) {
            circle.classList.add('completed');
            circle.classList.remove('active');
        } else if (circleStep === step) {
            circle.classList.add('active');
            circle.classList.remove('completed');
        } else {
            circle.classList.remove('active');
            circle.classList.remove('completed');
        }
    });
}

// Form validation
function validateCurrentStep() {
    if (currentStep === 1) {
        // Project type is always checked (has default)
        return true;
    } else if (currentStep === 2) {
        // Design style and features are checkboxes/radios, always valid
        return true;
    } else if (currentStep === 3) {
        const ideas = document.getElementById('project_ideas');
        const name = document.getElementById('client_name');
        const email = document.getElementById('client_email');
        
        return ideas.checkValidity() && name.checkValidity() && email.checkValidity();
    }
    return true;
}

btnNext.addEventListener('click', () => {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    } else {
        // Trigger default HTML validation bubbles if invalid (mostly for step 3 details)
        form.reportValidity();
    }
});

btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

// Form Submission & Web3Forms Email Notification Integration
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        form.reportValidity();
        return;
    }
    
    // Retrieve values
    const clientName = document.getElementById('client_name').value;
    const clientEmail = document.getElementById('client_email').value;
    const projectIdeas = document.getElementById('project_ideas').value;
    const projectType = document.querySelector('input[name="project_type"]:checked').value;
    const budgetVal = budgetDisplay.textContent;
    const designStyle = document.querySelector('input[name="design_style"]:checked').value;
    
    // Gather checkboxes
    const selectedFeatures = [];
    document.querySelectorAll('input[name="features"]:checked').forEach(cb => {
        selectedFeatures.push(cb.value);
    });
    const featuresStr = selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'None selected';
    
    // Get Web3Forms Access Key
    const keyInput = document.getElementById('web3forms-key');
    let accessKey = keyInput ? keyInput.value.trim() : '';
    let isSimulation = false;
    
    if (!accessKey) {
        accessKey = 'cf9f261c-6bd7-4cf0-8282-599c01c52a34';
    }
    
    // Update button text to loading state
    btnSubmit.disabled = true;
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 0.5rem;">✦</span> Submitting...`;
    
    // Form submission payload
    const formData = {
        access_key: accessKey,
        subject: `🌐 New Website Project Request from ${clientName}`,
        from_name: 'KD Software Labs Hub',
        name: clientName,
        email: clientEmail,
        'Project Type': projectType,
        'Estimated Budget': budgetVal,
        'Design Aesthetics': designStyle,
        'Required Features': featuresStr,
        'Project Ideas Description': projectIdeas
    };
    
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Success
            form.style.display = 'none';
            successScreen.style.display = 'block';
            
            // Save submission for Admin Dashboard monitoring (Offline and Cloud modes)
            const newSubmission = {
                id: 'SUB-' + Date.now(),
                date: new Date().toLocaleString('en-IN'),
                name: clientName,
                email: clientEmail,
                type: projectType,
                budget: budgetVal,
                design: designStyle,
                features: featuresStr,
                ideas: projectIdeas,
                timestamp: Date.now()
            };

            // 1. Local storage fallback
            try {
                const existing = JSON.parse(localStorage.getItem('kd_submissions') || '[]');
                existing.unshift(newSubmission);
                localStorage.setItem('kd_submissions', JSON.stringify(existing));
            } catch (storageErr) {
                console.error('Failed to save submission locally:', storageErr);
            }

            // 2. Firebase Cloud Database save (if active)
            if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive && db) {
                db.collection("submissions").doc(newSubmission.id).set({
                    ...newSubmission,
                    server_timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => console.log("Uploaded successfully to Firebase Firestore."))
                .catch(dbErr => console.error("Firebase DB upload error:", dbErr));
            }
            
            if (isSimulation) {
                // Inform developer details about simulation mode
                const note = document.createElement('p');
                note.style.color = 'var(--secondary)';
                note.style.fontSize = '0.8rem';
                note.style.marginTop = '1rem';
                note.innerHTML = `⚠️ <strong>Developer Notice:</strong> This submission was simulated using the default Web3Forms testing key. To receive real emails, generate a free access key at <a href="https://web3forms.com" target="_blank" style="color:var(--text-main);">web3forms.com</a> and paste it into the field at Step 3.`;
                successScreen.appendChild(note);
            }
        } else {
            alert('Submission failed: ' + result.message);
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        alert('An error occurred during submission. Please try again.');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
    }
});

// Reset Form function
btnResetForm.addEventListener('click', () => {
    // Remove simulation notices if any
    const notices = successScreen.querySelectorAll('p[style*="var(--secondary)"]');
    notices.forEach(n => n.remove());
    
    form.reset();
    currentStep = 1;
    budgetDisplay.textContent = '₹15,000';
    showStep(currentStep);
    
    successScreen.style.display = 'none';
    form.style.display = 'block';
});

// Add dynamic spinning keyframe
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);
