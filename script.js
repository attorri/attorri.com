// Door Animation
document.addEventListener('DOMContentLoaded', () => {
    // Create door elements
    const leftDoor = document.createElement('div');
    const rightDoor = document.createElement('div');
    leftDoor.className = 'left-door';
    rightDoor.className = 'right-door';
    document.body.appendChild(leftDoor);
    document.body.appendChild(rightDoor);

    // Remove doors after animation
    setTimeout(() => {
        leftDoor.remove();
        rightDoor.remove();
    }, 2000);

    // Add animation classes to cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Add animation classes to feature items
    const items = document.querySelectorAll('.feature-item');
    items.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add reveal class to elements we want to animate on scroll
document.querySelectorAll('.feature-card, .feature-item, .hero-title, .hero-subtitle').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update canvas size on window resize
window.addEventListener('resize', () => {
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(windowWidth, windowHeight);
    }
}); 