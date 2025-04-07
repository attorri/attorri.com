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

    // Progress bar interaction
    const progressBar = document.querySelector('.progress-bar');
    const progressNumbers = document.querySelectorAll('.progress-number');

    // Click handlers for progress numbers
    progressNumbers.forEach((number, index) => {
        number.addEventListener('click', () => {
            // Remove active class from all numbers
            progressNumbers.forEach(num => num.classList.remove('active'));
            // Add active class to clicked number
            number.classList.add('active');
        });
    });

    // Set initial active state
    if (progressNumbers.length > 0) {
        progressNumbers[0].classList.add('active');
    }

    // Smooth scroll animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });

    // Animate icons on hover
    const cardIcons = document.querySelectorAll('.card-icon');
    cardIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
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

// Update canvas size on window resize
window.addEventListener('resize', () => {
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(windowWidth, windowHeight);
    }
}); 