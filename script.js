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

    /* --- Scroll Spy / Active Link Highlighting --- */
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

            if (!name || !message) {
                alert("Please fill in all required fields.");
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
                    approved: false,
                    createdAt: serverTimestamp()
                });

                alert("Thank you! Your feedback has been submitted for review.");
                feedbackForm.reset();

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
                    card.innerHTML = `
                        <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
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
