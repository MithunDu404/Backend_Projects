document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:5001/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Submission failed');

            showSuccess();
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    const statsBtn = document.getElementById('statsBtn');
    const statsResult = document.getElementById('statsResult');

    statsBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('http://localhost:5001/api/stats');
            const data = await res.json();

            if (data.total_submissions !== undefined) {
                statsResult.innerText = `Total submissions: ${data.total_submissions} | Latest: ${data.latest_name}`;
                statsResult.style.display = 'block';
                statsResult.scrollIntoView({ behavior: 'smooth' });
            } else {
                statsResult.innerText = 'Error fetching stats';
                statsResult.style.display = 'block';
            }
        } catch (err) {
            statsResult.innerText = 'Something went wrong!';
            statsResult.style.display = 'block';
        }
    });


    function validateForm() {
        let valid = true;

        // Required field IDs
        const fields = ['firstName', 'lastName', 'email', 'subject', 'message'];

        fields.forEach(id => {
            const input = document.getElementById(id);
            const error = document.getElementById(id + 'Error');
            const value = input.value.trim();

            input.classList.remove('input-error');
            error.style.display = 'none';

            if (!value || (id === 'message' && value.length < 10)) {
                input.classList.add('input-error');
                error.style.display = 'block';
                valid = false;
            }

            if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                input.classList.add('input-error');
                error.textContent = 'Please enter a valid email address';
                error.style.display = 'block';
                valid = false;
            }
        });

        // Optional phone validation
        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phoneValue = phone.value.trim();
        const phoneValid = /^[\+]?[\d\s\-()]{10,}$/.test(phoneValue);

        phone.classList.remove('input-error');
        phoneError.style.display = 'none';

        if (phoneValue && !phoneValid) {
            phone.classList.add('input-error');
            phoneError.style.display = 'block';
            valid = false;
        }

        return valid;
    }

    function showSuccess() {
        successMessage.style.display = 'block';
        form.reset();
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
});
