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


    // ─── NEON PARTICLE CANVAS (About / Skills / Projects) ────────
    function initNeonCanvas(canvasId, colors) {
        const cv = document.getElementById(canvasId);
        if (!cv) return;
        const ctx = cv.getContext('2d');
        const particles = [];
        const count = 38;

        function resize() {
            cv.width  = cv.offsetWidth;
            cv.height = cv.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < count; i++) {
            particles.push({
                x:   Math.random() * cv.width,
                y:   Math.random() * cv.height,
                r:   Math.random() * 2.4 + 0.6,
                dx:  (Math.random() - 0.5) * 0.45,
                dy:  (Math.random() - 0.5) * 0.45,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.15,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, cv.width, cv.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.shadowBlur = 18;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > cv.width)  p.dx *= -1;
                if (p.y < 0 || p.y > cv.height)  p.dy *= -1;
            });

            // Draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = particles[i].color;
                        ctx.globalAlpha = (1 - dist / 120) * 0.18;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    initNeonCanvas('canvas-about',    ['#6366f1', '#8b5cf6', '#3b82f6', '#a5b4fc']);
    initNeonCanvas('canvas-skills',   ['#06b6d4', '#10b981', '#6366f1', '#67e8f9']);
    initNeonCanvas('canvas-projects', ['#fb7185', '#f97316', '#8b5cf6', '#fbbf24']);


    // ─── 3D CARD TILT ON PROJECT CARDS ───────────────────────────
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width  / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -8;
            const rotY = ((x - cx) / cx) *  8;
            card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ─── SCROLL REVEAL (reveal + skill-card + roadmap-item) ───────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .skill-card, .roadmap-item').forEach(el => revealObserver.observe(el));


    // ─── NEURAL NETWORK ANIMATION (Roadmap) ──────────────────────
    (function initNeuralNet() {
        const cv = document.getElementById('canvas-neural');
        if (!cv) return;
        const ctx = cv.getContext('2d');

        function resize() {
            cv.width  = cv.offsetWidth;
            cv.height = cv.offsetHeight;
            buildNetwork();
        }

        // Network architecture: [input, h1, h2, h3, output]
        const LAYERS = [4, 5, 5, 4, 3];
        const COLORS = {
            node:   '#8b5cf6',
            nodeLit:'#c4b5fd',
            line:   'rgba(139,92,246,',
            pulse:  '#f0abfc',
            glow:   '#7c3aed',
        };

        let nodes = [];   // { x, y, lit, ring }
        let edges = [];   // { a, b, w, pulses[] }

        function buildNetwork() {
            nodes = [];
            edges = [];
            const W = cv.width, H = cv.height;
            const layerGap = W / (LAYERS.length + 1);

            // Place nodes
            LAYERS.forEach((count, li) => {
                const x = layerGap * (li + 1);
                const nodeGap = H / (count + 1);
                for (let ni = 0; ni < count; ni++) {
                    nodes.push({
                        x, y: nodeGap * (ni + 1),
                        lit: 0,   // 0–1 brightness
                        ring: 0,  // pulse ring radius
                        layer: li,
                    });
                }
            });

            // Build edges between adjacent layers
            let offset = 0;
            for (let li = 0; li < LAYERS.length - 1; li++) {
                const aCount = LAYERS[li];
                const bCount = LAYERS[li + 1];
                const bOffset = offset + aCount;
                for (let ai = 0; ai < aCount; ai++) {
                    for (let bi = 0; bi < bCount; bi++) {
                        edges.push({
                            a: offset + ai,
                            b: bOffset + bi,
                            w: Math.random() * 0.6 + 0.15,  // weight → opacity
                            pulses: [],  // { t } t=0..1 along edge
                        });
                    }
                }
                offset += aCount;
            }
        }

        // Spawn a random signal pulse from a random node every ~900ms
        let lastPulse = 0;
        function spawnPulse(now) {
            if (now - lastPulse < 900) return;
            lastPulse = now;
            // Pick a random edge
            const e = edges[Math.floor(Math.random() * edges.length)];
            e.pulses.push({ t: 0, speed: 0.008 + Math.random() * 0.006 });
            // Light up source node
            nodes[e.a].lit = 1;
        }

        function drawNode(n) {
            const r = 7;
            // Glow
            const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
            const brightness = 0.12 + n.lit * 0.55;
            grd.addColorStop(0, `rgba(139,92,246,${brightness})`);
            grd.addColorStop(1, 'rgba(139,92,246,0)');
            ctx.beginPath();
            ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            // Node circle
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fillStyle = n.lit > 0.3 ? COLORS.nodeLit : COLORS.node;
            ctx.shadowBlur = n.lit > 0.3 ? 20 : 6;
            ctx.shadowColor = COLORS.glow;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Pulse ring
            if (n.ring > 0) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, r + n.ring * 18, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(196,181,253,${(1 - n.ring) * 0.7})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        function drawEdge(e) {
            const A = nodes[e.a], B = nodes[e.b];
            ctx.beginPath();
            ctx.moveTo(A.x, A.y);
            ctx.lineTo(B.x, B.y);
            ctx.strokeStyle = COLORS.line + (e.w * 0.35) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Draw each pulse dot along the edge
            e.pulses.forEach(p => {
                const px = A.x + (B.x - A.x) * p.t;
                const py = A.y + (B.y - A.y) * p.t;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = COLORS.pulse;
                ctx.shadowBlur = 14;
                ctx.shadowColor = COLORS.pulse;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }

        function update(now) {
            edges.forEach(e => {
                e.pulses = e.pulses.filter(p => {
                    p.t += p.speed;
                    if (p.t >= 1) {
                        // Light up destination node
                        nodes[e.b].lit = 1;
                        nodes[e.b].ring = 0.01;
                        return false;
                    }
                    return true;
                });
            });

            // Decay node glow
            nodes.forEach(n => {
                n.lit  = Math.max(0, n.lit  - 0.018);
                n.ring = Math.min(1, n.ring + 0.04);
                if (n.ring >= 1) n.ring = 0;
            });

            spawnPulse(now);
        }

        function frame(now) {
            ctx.clearRect(0, 0, cv.width, cv.height);
            update(now);
            edges.forEach(drawEdge);
            nodes.forEach(drawNode);
            requestAnimationFrame(frame);
        }

        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(frame);
    })();




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
