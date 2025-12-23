// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- Typing Effect ---
const titles = ["Building with CodeWithAI", "AI-Powered Frontend Developer"];
const typingTextElement = document.getElementById('typing-text');
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingTextElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before new word
    }

    setTimeout(type, typingSpeed);
}

// Start typing loop
document.addEventListener('DOMContentLoaded', type);

// --- No Loading Screen ---


// --- Scroll Animations (ScrollTrigger) ---
const setupScrollAnimations = () => {
    // Fade Up Elements
    gsap.utils.toArray('.fade-up').forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Fade Right Elements
    gsap.utils.toArray('.fade-right').forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Fade Left Elements
    gsap.utils.toArray('.fade-left').forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Batch Project Cards
    gsap.set(".project-card", { opacity: 0, y: 30 });
    ScrollTrigger.batch(".project-card", {
        start: "top 85%",
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            overwrite: true
        }),
    });
};

setupScrollAnimations();

// --- Navbar Scroll Effect & Active Link Logic ---
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

const updateNavbar = () => {
    // 1. Transparent/Blur effect
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/80', 'dark:bg-slate-900/80', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.remove('bg-white', 'dark:bg-slate-800', 'shadow-md');
    } else {
        navbar.classList.remove('bg-white/80', 'dark:bg-slate-900/80', 'backdrop-blur-md', 'shadow-lg');
        navbar.classList.add('bg-white', 'dark:bg-slate-800', 'shadow-md');
    }

    // 2. Active Link Highlighting
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 250)) { // Adjusted offset
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1); // remove #
        const activeLine = link.querySelector('.active-line');
        const textSpan = link;

        if (href === current) {
            textSpan.classList.add('text-primary');
            textSpan.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white');
            if (activeLine) {
                activeLine.classList.remove('hidden');
                activeLine.classList.add('block');
            }
        } else {
            textSpan.classList.remove('text-primary');
            textSpan.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:text-black', 'dark:hover:text-white');
            if (activeLine) {
                activeLine.classList.add('hidden');
                activeLine.classList.remove('block');
            }
        }
    });
};

window.addEventListener('scroll', updateNavbar);
window.addEventListener('load', updateNavbar); // Initial call

// --- Dark Mode Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;
const heroImage = document.querySelector('#hero-image img'); // Select the hero image

// Assets
const lightImage = 'assets/hero-image.png';
const darkImage = 'assets/hero-image-dark.png';

// Check Local Storage or System Preference
const currentTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    htmlElement.classList.add('dark');
    themeIcon.setAttribute('data-lucide', 'sun');
    if (heroImage) heroImage.src = darkImage;
} else {
    htmlElement.classList.remove('dark');
    themeIcon.setAttribute('data-lucide', 'moon');
    if (heroImage) heroImage.src = lightImage;
}

// Re-render icons after initial load if needed
if (window.lucide) {
    lucide.createIcons();
}

// Toggle Event
themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');

    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.setAttribute('data-lucide', 'sun');
        if (heroImage) heroImage.src = darkImage;
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.setAttribute('data-lucide', 'moon');
        if (heroImage) heroImage.src = lightImage;
    }

    // Refresh Lucide icons to update the sun/moon
    if (window.lucide) {
        lucide.createIcons();
    }
});
