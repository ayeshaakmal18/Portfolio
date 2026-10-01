const roles = [
    'Frontend Developer',
    'UI Designer',
    'Creative Coder'
];
const typedText = document.querySelector('.typed-text');
let charIndex = 0;
let roleIndex = 0;
let typingForward = true;

function updateRole() {
    if (!typedText) return;
    const currentRole = roles[roleIndex];
    typedText.textContent = currentRole.slice(0, charIndex);

    if (typingForward) {
        if (charIndex < currentRole.length) {
            charIndex += 1;
        } else {
            typingForward = false;
            setTimeout(updateRole, 1200);
            return;
        }
    } else {
        if (charIndex > 0) {
            charIndex -= 1;
        } else {
            typingForward = true;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(updateRole, typingForward ? 90 : 50);
}

window.addEventListener('DOMContentLoaded', () => {
    updateRole();

    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    function setMenuOpen(isOpen) {
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        menuToggle.querySelector('i').classList.toggle('fa-bars', !isOpen);
        menuToggle.querySelector('i').classList.toggle('fa-xmark', isOpen);
        navbar.classList.toggle('is-open', isOpen);
    }

    menuToggle.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navbar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) setMenuOpen(false);
    });

    const slides = document.querySelectorAll('.about-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length) {
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 3000);
    }

    const carousel = document.querySelector('.portfolio-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.portfolio-grid');
    const previousButton = carousel.querySelector('[data-direction="previous"]');
    const nextButton = carousel.querySelector('[data-direction="next"]');
    const status = carousel.querySelector('.carousel-status');

    function getMetrics() {
        const cards = Array.from(track.children);
        const firstCard = cards[0];

        if (!firstCard) {
            return { cards, visibleCount: 0, step: 0, index: 0, maxIndex: 0 };
        }

        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const step = cardWidth + gap;
        const visibleCount = Math.max(1, Math.round((track.clientWidth + gap) / step));
        const maxIndex = Math.max(0, cards.length - visibleCount);
        const index = Math.min(maxIndex, Math.max(0, Math.round(track.scrollLeft / step)));

        return { cards, visibleCount, step, index, maxIndex };
    }

    function updateCarousel() {
        const { cards, visibleCount, index, maxIndex } = getMetrics();
        previousButton.disabled = index === 0;
        nextButton.disabled = index >= maxIndex;
        status.textContent = cards.length
            ? `${index + 1}-${Math.min(index + visibleCount, cards.length)} of ${cards.length}`
            : '0 projects';
    }

    function moveCarousel(direction) {
        const { index, maxIndex, step, visibleCount } = getMetrics();
        const pageStart = Math.floor(index / visibleCount) * visibleCount;
        const nextIndex = direction > 0
            ? Math.min(maxIndex, pageStart + visibleCount)
            : index === pageStart
                ? Math.max(0, index - visibleCount)
                : pageStart;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        track.scrollTo({ left: nextIndex * step, behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    previousButton.addEventListener('click', () => moveCarousel(-1));
    nextButton.addEventListener('click', () => moveCarousel(1));
    track.addEventListener('scroll', updateCarousel, { passive: true });
    window.addEventListener('resize', updateCarousel);
    new MutationObserver(updateCarousel).observe(track, { childList: true });
    updateCarousel();
});
