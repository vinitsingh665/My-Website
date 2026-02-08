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

// --- Project Modal Logic ---
const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
const modalBody = document.getElementById('modal-body');

const projectData = {
    'miyo': {
        title: 'Miyo – AI Virtual Character Project',
        description: `
            <div class="space-y-6">
                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Miyo is an AI-based virtual character project designed to explore how personality, visuals, and interaction can be combined into a digital character experience.
                </p>
                
                <div>
                    <h4 class="text-xl font-bold text-dark dark:text-gray-100 mb-3">Key Features</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-2">
                        <li>AI-driven character interactions</li>
                        <li>Dynamic visual personality expression</li>
                        <li>Interactive web-based presentation</li>
                        <li>Integration of modern frontend & AI tools</li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-xl font-bold text-dark dark:text-gray-100 mb-3">About the Project</h4>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                        The project focuses on character presentation, background design, motion styling, and AI-assisted content creation. Using modern tools and AI workflows, Miyo represents an experiment in building engaging virtual identities that can be used for content, branding, or interactive experiences.
                    </p>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                        This project reflects my interest in blending creativity, frontend visuals, and AI-powered workflows to build expressive digital characters.
                    </p>
                </div>
            </div>
        `
    }
    // Add more projects here if needed
};

function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
        <h2 class="text-3xl font-bold text-dark dark:text-gray-100 mb-6">${data.title}</h2>
        ${data.description}
    `;

    modal.classList.remove('hidden');
    // Small delay to allow display:block to apply before changing opacity for transition
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);

    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }, 300); // Match transition duration
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// --- Pagination Logic ---
const setupPagination = (itemsPerPage = 4) => {
    const projectGrid = document.getElementById('projects-grid');
    if (!projectGrid) return;

    const projectCards = Array.from(projectGrid.children);
    const paginationControls = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(projectCards.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationControls.style.display = 'none';
        projectCards.forEach(card => card.style.display = '');
        return;
    }

    const showPage = (page) => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        projectCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = '';
                // Optional: Re-trigger animation if needed, but display block is enough
                gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
            } else {
                card.style.display = 'none';
            }
        });

        renderControls(page);
        ScrollTrigger.refresh();
    };

    const renderControls = (currentPage) => {
        paginationControls.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `w-10 h-10 rounded-full font-bold transition-all ${i === currentPage
                ? 'bg-primary text-white shadow-lg scale-110'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`;
            btn.onclick = () => showPage(i);
            paginationControls.appendChild(btn);
        }
    };

    // Initialize Page 1
    showPage(1);

    // Refresh ScrollTrigger after layout changes
    ScrollTrigger.refresh();
};

// Start pagination after load
window.addEventListener('load', () => setupPagination(4)); // 4 items per page as requested
