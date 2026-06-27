/* ══════════════════════════════════════════════════════════
   MD Ashab Hossain — Portfolio Scripts
   Warm, organic, fluid-motion design
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initNavbar();
    initGalleries();
    initLightbox();
    initScrollReveal();
    initStatCounters();
    initFluidParallax();
    initSmoothHoverTilt();
});

/* ─────────────────────────────────── Typewriter Effect ─────────────────────────────────── */
function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;

    const phrases = [
        'autonomous robots.',
        'ML-powered systems.',
        'thermal control units.',
        'data acquisition systems.',
        'intelligent navigation.',
        'precision instruments.'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 80;

    function tick() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            speed = 45;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            speed = 85;
        }

        if (!isDeleting && charIdx === current.length) {
            speed = 2400;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 600;
        }

        setTimeout(tick, speed);
    }
    setTimeout(tick, 2000);
}

/* ─────────────────────────────────── Navbar ─────────────────────────────────── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navAnchors = document.querySelectorAll('.nav-link');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    navAnchors.forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('.section, .hero');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    }
}

/* ─────────────────────────────────── Image Galleries ─────────────────────────────────── */
function initGalleries() {
    document.querySelectorAll('.project-card, .research-gallery').forEach(card => {
        const images = card.querySelectorAll('.project-img');
        const dots = card.querySelectorAll('.gallery-dot');
        if (images.length < 2) return;

        let current = 0;
        let autoTimer;

        function show(idx) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            images[idx].classList.add('active');
            dots[idx].classList.add('active');
            current = idx;
        }

        function autoAdvance() {
            autoTimer = setInterval(() => {
                show((current + 1) % images.length);
            }, 5000);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(autoTimer);
                show(parseInt(dot.dataset.index));
                autoAdvance();
            });
        });

        autoAdvance();
    });
}

/* ─────────────────────────────────── Lightbox ─────────────────────────────────── */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    if (!lightbox) return;

    document.querySelectorAll('.project-img, .research-img-card img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

/* ─────────────────────────────────── Scroll Reveal — fluid stagger ─────────────────────────────────── */
function initScrollReveal() {
    const selectors = [
        '.about-text', '.about-details',
        '.skill-category',
        '.project-card',
        '.research-hero', '.research-content', '.research-tech-stack',
        '.timeline-item',
        '.contact-card', '.contact-lead',
        '.reference-card',
        '.stat-card', '.detail-card'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach((el, i) => {
        el.classList.add('reveal');
        // Add a small stagger based on siblings
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const siblingIndex = siblings.indexOf(el);
        if (siblingIndex > 0) {
            el.style.transitionDelay = (siblingIndex * 0.08) + 's';
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─────────────────────────────────── Stat Counters ─────────────────────────────────── */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                let count = 0;
                const duration = 1400;
                const step = Math.max(1, Math.ceil(target / (duration / 30)));

                function animate() {
                    count += step;
                    if (count >= target) {
                        el.textContent = target;
                    } else {
                        el.textContent = count;
                        requestAnimationFrame(animate);
                    }
                }
                animate();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ─────────────────────────────────── Fluid Parallax ─────────────────────────────────── */
function initFluidParallax() {
    const blobs = document.querySelectorAll('.blob');
    if (!blobs.length) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScroll = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                blobs.forEach((blob, i) => {
                    const speed = 0.03 + (i * 0.015);
                    const yOffset = lastScroll * speed;
                    blob.style.transform = `translateY(${-yOffset}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ─────────────────────────────────── Smooth Hover Tilt (desktop only) ─────────────────────────────────── */
function initSmoothHoverTilt() {
    if (window.matchMedia('(hover: none)').matches) return;

    const tiltCards = document.querySelectorAll('.project-card, .skill-category, .contact-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        });
    });
}
