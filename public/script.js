document.addEventListener('DOMContentLoaded', () => {

    // ─── CANVAS IMAGE SEQUENCE ANIMATION ─────────────────────────
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');
    const frameCount = 96;
    
    const currentFrame = index => `assets/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
    
    const images = [];
    let imagesLoaded = 0;
    let currentFrameIndex = 0;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function renderFrame(index) {
        const img = images[index];
        if (!img || !context) return;

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    function animateLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        if (delta >= interval) {
            if (imagesLoaded === frameCount) {
                renderFrame(currentFrameIndex);
                currentFrameIndex = (currentFrameIndex + 1) % frameCount;
            }
            lastTime = timestamp - (delta % interval);
        }
        requestAnimationFrame(animateLoop);
    }

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => { imagesLoaded++; };
        images.push(img);
    }
    requestAnimationFrame(animateLoop);


    // ─── CUSTOM CURSOR ────────────────────────────────────────────
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        cursorDot.style.left = x + 'px';
        cursorDot.style.top = y + 'px';
        // Smooth lag for outline
        outlineX += (x - outlineX) * 0.18;
        outlineY += (y - outlineY) * 0.18;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
    });

    function smoothCursor() {
        outlineX += (parseFloat(cursorDot.style.left || 0) - outlineX) * 0.18;
        outlineY += (parseFloat(cursorDot.style.top || 0) - outlineY) * 0.18;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(smoothCursor);
    }
    smoothCursor();


    // ─── NAVBAR SCROLL ────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });


    // ─── MOBILE NAV TOGGLE ────────────────────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });


    // ─── ACTIVE SECTION HIGHLIGHT ─────────────────────────────────
    const sections = document.querySelectorAll('section');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(s => sectionObserver.observe(s));


    // ─── SCROLL REVEAL ────────────────────────────────────────────
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));


    // ─── CONTACT FORM ─────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        try {
            const res  = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await res.json();

            if (data.success) {
                formStatus.textContent = '✓ Message sent! I\'ll be in touch soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                formStatus.textContent = data.message || 'Something went wrong. Try again.';
                formStatus.className = 'form-status error';
            }
        } catch {
            formStatus.textContent = 'Network error. Please try again.';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 6000);
        }
    });

});
