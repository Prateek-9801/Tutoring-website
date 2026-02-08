# Prateek's Tutoring & Portfolio Website

A modern, responsive tutoring and portfolio website featuring student
testimonials, dark mode support, and real-time feedback management
using Firebase Firestore.

## Overview

This website serves as both a tutoring service platform and a
professional portfolio for Prateek, offering tutoring in Mathematics
(Classes 5-10) and Computer Science (C Programming, Coding
Basics). The site includes an interactive feedback system where
students can leave testimonials that are moderated before being
displayed publicly.

**Live Site:** [https://prateek-9801.github.io/Tutoring-website/](https://prateek-9801.github.io/Tutoring-website/)

## Features

- **Responsive Design** - Mobile-first approach with hamburger menu for mobile devices
- **Dark Mode** - Toggle between light and dark themes with localStorage persistence
- **Interactive Testimonials** - Firebase Firestore integration for real-time feedback
- **Star Rating System** - 5-star rating input with hover and click interactions
- **WhatsApp Integration** - Floating WhatsApp button for direct contact
- **Smooth Navigation** - Active section highlighting and smooth scrolling
- **Moderated Feedback** - Admin approval system for testimonials before publishing
- **SEO Optimized** - Open Graph and Twitter Card meta tags

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Firebase Firestore (NoSQL database)
- **Fonts:** Google Fonts (Open Sans, Poppins)
- **Icons:** Font Awesome 6.0
- **Hosting:** GitHub Pages

## Installation

1. Clone the repository:

```bash
git clone https://github.com/prateek-9801/Tutoring-website.git
cd Tutoring-website
```

1. Install pre-commit hooks (for development):

```bash
pre-commit install
```

1. Open `index.html` in your browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

1. Visit `http://localhost:8000` in your browser

## Firebase Configuration

The site uses Firebase Firestore for testimonials. The configuration
is already set up in `index.html`, but if you need to use your own
Firebase project:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Replace the Firebase config in `index.html` (lines 228-236)
4. Set up Firestore security rules to allow reading approved
   testimonials and writing new feedback

### Firestore Collections

**feedbacks** collection structure:

```javascript
{
  name: string,           // Student/Parent name
  classSubject: string,   // Optional: Class/Subject info
  message: string,        // Feedback message
  rating: number,         // 1-5 star rating
  approved: boolean,      // Moderation flag
  createdAt: timestamp    // Auto-generated timestamp
}
```

## Project Structure

```text
Tutoring-website/
├── index.html          # Main HTML file
├── style.css           # Styles and responsive design
├── script.js           # JavaScript functionality
├── og-image.png        # Open Graph preview image
├── README.md           # This file
```

## Usage

### For Students/Parents

1. Browse subjects and services
2. View student testimonials
3. Submit feedback (requires moderation approval)
4. Contact via email, phone, or WhatsApp

### For Development

- **Dark Mode:** Click the moon/sun icon in the navigation
- **Mobile Menu:** Click the hamburger menu on mobile devices
- **Navigation:** Auto-highlights current section on scroll

## Development

### Prerequisites

- Git
- Modern web browser
- (Optional) Local web server for testing

### Running Locally

```bash
# Clone and navigate to project
git clone https://github.com/prateek-9801/Tutoring-website.git
cd Tutoring-website

# Install development dependencies
pre-commit install

# Start local server (Python example)
python -m http.server 8000
```

### Making Changes

1. Create a feature branch
2. Make your changes
3. Test thoroughly (especially mobile responsiveness)
4. Pre-commit hooks will run automatically on commit
5. Submit a pull request

## Deployment

The site is deployed using GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Pages automatically deploys from the repository

## Contact Information

- **Email:** <prateekshivastava038@gmail.com>
- **Phone:** +91 97557 06618
- **WhatsApp:** [Chat on WhatsApp](https://wa.me/919755706618)

## License

© 2026 Prateek's Tutoring. All Rights Reserved.

## Future Enhancements

- [ ] Admin dashboard for testimonial moderation
- [ ] Online booking system
- [ ] Payment integration
- [ ] Student progress tracking
- [ ] Video testimonials
- [ ] Blog section for educational content
