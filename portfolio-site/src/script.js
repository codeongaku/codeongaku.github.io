// Typing animation
const text = "Software Engineering Student";
const typingElement = document.getElementById("typing-text");
let index = 0;
let isDeleting = false;
let pause = false;

function type() {
    if (!isDeleting && index <= text.length) {
        typingElement.innerHTML = text.substring(0, index) + '<span class="typing-cursor"></span>';
        index++;
        
        if (index > text.length) {
            pause = true;
            setTimeout(() => {
                pause = false;
            }, 2000); // Pause for 2 seconds when fully typed
        }
    }
    
    const speed = isDeleting ? 50 : 100;
    if (!pause) {
        setTimeout(type, speed);
    } else {
        setTimeout(type, 2000);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(type, 500); // Start after 0.5 second delay
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active state to navigation
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.style.backgroundColor = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }
    });
});
