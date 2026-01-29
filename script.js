import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Menu Toggle --- */
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu state on hamburger click
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    /* --- Dark Mode Toggle --- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight when we are scrolling 1/3 into the section (minus nav height offset approx)
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            } else if (current === '' && link.getAttribute('href') === '#home') {
                // Default to home if at top
                link.classList.add('active');
            }
        });
    });

    /* --- Star Rating Handling --- */
    const starContainer = document.getElementById('star-rating-input');
    const ratingInput = document.getElementById('rating-value');

    if (starContainer && ratingInput) {
        const stars = starContainer.querySelectorAll('i');

        // Handle click
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                ratingInput.value = value;
                updateStarVisuals(value);
            });

            // Handle hover
            star.addEventListener('mouseover', () => {
                updateStarVisuals(star.getAttribute('data-value'), true);
            });
        });

        // Reset to selected value on mouse leave
        starContainer.addEventListener('mouseleave', () => {
            updateStarVisuals(ratingInput.value, false);
        });

        function updateStarVisuals(value, isHover) {
            if (!value && !isHover) value = 0; // ensure reset if nothing selected
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                s.classList.remove('active', 'hover');
                if (sVal <= value) {
                    s.classList.add(isHover ? 'hover' : 'active');
                }
            });
        }
    }

    /* --- Feedback Form Handling --- */
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('parent-name');
            const classInput = document.getElementById('class-subject');
            const messageInput = document.getElementById('feedback-text');

            const name = nameInput.value.trim();
            const classSubject = classInput ? classInput.value.trim() : '';
            const message = messageInput.value.trim();
            const rating = ratingInput ? parseInt(ratingInput.value) : 0;

            if (!name || !message || !rating) {
                alert("Please fill in all required fields, including the rating.");
                return;
            }

            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                // Check if window.db (Firestore) is available per instructions
                if (!window.db) {
                    console.error("Firestore instance (window.db) not found. Check index.html initialization.");
                    throw new Error("Service unavailable.");
                }

                await addDoc(collection(window.db, "feedbacks"), {
                    name: name,
                    classSubject: classSubject,
                    message: message,
                    rating: rating,
                    approved: false,
                    createdAt: serverTimestamp()
                });

                alert("Thank you! Your feedback has been submitted for review.");
                feedbackForm.reset();
                // Reset stars
                if (ratingInput) ratingInput.value = '';
                if (starContainer) {
                    const stars = starContainer.querySelectorAll('i');
                    stars.forEach(s => s.classList.remove('active', 'hover'));
                }

            } catch (error) {
                console.error("Error adding feedback: ", error);
                alert("Something went wrong. Please try again later.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    /* --- Load Testimonials --- */
    async function loadTestimonials() {
        const container = document.getElementById('testimonials-grid');
        if (!container || !window.db) return;

        try {
            // Query only by approved status to avoid index issues with orderBy
            const q = query(
                collection(window.db, "feedbacks"),
                where("approved", "==", true)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                container.innerHTML = ''; // Clear static placeholders

                // Convert to array and sort client-side
                const testimonials = [];
                querySnapshot.forEach((doc) => {
                    testimonials.push(doc.data());
                });

                // Sort by createdAt desc (handle nulls safely)
                testimonials.sort((a, b) => {
                    const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
                    const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
                    return timeB - timeA;
                });

                testimonials.forEach((data) => {
                    const card = document.createElement('div');
                    card.className = 'testimonial-card';

                    // Generate Star Rating HTML
                    let starsHtml = '';
                    if (data.rating) {
                        starsHtml = '<div class="testimonial-rating">';
                        for (let i = 1; i <= 5; i++) {
                            if (i <= data.rating) {
                                starsHtml += '<i class="fas fa-star"></i>';
                            } else {
                                starsHtml += '<i class="fas fa-star" style="color: #e2e8f0;"></i>';
                            }
                        }
                        starsHtml += '</div>';
                    }

                    card.innerHTML = `
                        <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                        ${starsHtml}
                        <p class="testimonial-text">"${escapeHtml(data.message)}"</p>
                        <div class="testimonial-author">
                            <h4>${escapeHtml(data.name)}</h4>
                            <span>${escapeHtml(data.classSubject || 'Student')}</span>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Error loading testimonials:", error);
        }
    }

    // specific helper to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Call function
    loadTestimonials();

    console.log("Website upgraded and ready!");
});
