// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Initialize elements
const whaleContainer = document.getElementById('whaleContainer');
const bubblesContainer = document.getElementById('bubbles');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.querySelector('.chat-input');
const submitButton = document.querySelector('.submit-button');

// Create multiple whales with different paths
function createWhales() {
    const paths = [
        'M0,100 C50,50 150,150 300,100',
        'M0,200 C100,150 200,250 300,200',
        'M0,300 C150,250 250,350 300,300'
    ];

    paths.forEach((path, index) => {
        const whale = document.createElement('div');
        whale.className = 'whale';
        whale.textContent = '🐋';
        whaleContainer.appendChild(whale);

        gsap.set(whale, {
            x: -50,
            y: 100 + (index * 100)
        });

        gsap.to(whale, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5]
            },
            duration: 10 + (index * 2),
            repeat: -1,
            ease: 'none',
            opacity: 0.8,
            scale: 1.2,
            yoyo: true
        });
    });
}

// Create floating bubbles
function createBubbles() {
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubblesContainer.appendChild(bubble);

        const size = Math.random() * 20 + 5;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 5;

        gsap.set(bubble, {
            x: startX,
            y: window.innerHeight,
            width: size,
            height: size,
            opacity: Math.random() * 0.5
        });

        gsap.to(bubble, {
            y: -50,
            duration: duration,
            repeat: -1,
            ease: 'none',
            opacity: 0,
            delay: Math.random() * 5
        });
    }
}

// Animate chat messages
function animateMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    gsap.from(messageDiv, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle chat submission
function handleSubmit() {
    const message = chatInput.value.trim();
    if (message) {
        animateMessage(message, true);
        chatInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That's an interesting question about AI!",
                "Let me dive deep into that topic...",
                "The ocean of AI knowledge is vast!",
                "Whale, let me think about that..."
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            animateMessage(response, false);
        }, 1000);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createWhales();
    createBubbles();

    // Add event listeners
    submitButton.addEventListener('click', handleSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });

    // Add scroll-triggered animations
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top center'
        }
    });

    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top center'
        }
    });

    gsap.from('.chat-container', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.chat-container',
            start: 'top center'
        }
    });
}); 