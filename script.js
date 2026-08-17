/* ==========================================================================
   SS Mobile Repair & Accessories — script.js
   Handles: mobile nav, scroll reveals, navbar state, active link tracking,
   animated stat counters, diagnostic terminal typing, services rendering,
   contact form validation, back-to-top button.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Mobile navigation ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Navbar scrolled state + back-to-top ---------------- */
  const navbar = document.getElementById('navbar');
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    navbar && navbar.classList.toggle('scrolled', scrolled);
    toTopBtn && toTopBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn && toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---------------- Scroll reveal animations ---------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Animated stat counters ---------------- */
  const statNums = document.querySelectorAll('.stat-num');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));

  /* ---------------- Diagnostic terminal typing effect ---------------- */
  const diagLines = document.querySelectorAll('#diagLines li');
  diagLines.forEach((li, i) => {
    const text = li.getAttribute('data-text') || '';
    li.textContent = text;
    li.style.setProperty('--w', `${text.length}ch`);
    li.style.animationDuration = `${Math.max(text.length * 0.035, 0.4)}s`;
    li.style.animationTimingFunction = `steps(${text.length}, end)`;
    li.style.animationDelay = `${i * 0.5 + 0.4}s`;
  });

  /* ---------------- Services data + render ---------------- */
  const services = [
    { name: 'Android Repair', desc: 'Full diagnostics and repair for all major Android brands and models.', icon: `<path d="M6 9v7a1 1 0 0 0 1 1h1v3a1.5 1.5 0 0 0 3 0v-3h2v3a1.5 1.5 0 0 0 3 0v-3h1a1 1 0 0 0 1-1V9H6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 9a6 6 0 0 1 12 0M9 5l-1-1.7M15 5l1-1.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9.5" cy="7.5" r=".6" fill="currentColor"/><circle cx="14.5" cy="7.5" r=".6" fill="currentColor"/>` },
    { name: 'iPhone Repair', desc: 'Certified iPhone repairs from cracked screens to internal faults.', icon: `<rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 5.5h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="18" r="1" fill="currentColor"/>` },
    { name: 'Motherboard Repair', desc: 'Advanced diagnostics and micro-soldering for logic board issues.', icon: `<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="1.4" stroke="currentColor" stroke-width="1.5"/><path d="M9.4 8H15a2 2 0 0 1 2 2v1.5M8 9.4V16a2 2 0 0 0 2 2h1.5M16 13.5h2.5M13.5 16h2v2h-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` },
    { name: 'CPU Level Repair', desc: 'Chip-level diagnostics and repair for the toughest hardware faults.', icon: `<rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M9 3.5v2M12 3.5v2M15 3.5v2M9 18.5v2M12 18.5v2M15 18.5v2M3.5 9h2M3.5 12h2M3.5 15h2M18.5 9h2M18.5 12h2M18.5 15h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` },
    { name: 'Charging Issue Repair', desc: 'Port cleaning, IC replacement, and fixes for slow or failed charging.', icon: `<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>` },
    { name: 'Display Replacement', desc: 'Crisp, color-accurate screen replacements with genuine-grade panels.', icon: `<rect x="3" y="4" width="18" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 20.5h8M12 17.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` },
    { name: 'Battery Replacement', desc: 'Restore full-day battery life with high-capacity genuine cells.', icon: `<rect x="2.5" y="8" width="16" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M20.5 10.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 10.5v3M9 10.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` },
    { name: 'Camera Repair', desc: 'Lens, sensor, and camera module repair for sharp photos again.', icon: `<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.2" stroke="currentColor" stroke-width="1.5"/>` },
    { name: 'Speaker Repair', desc: 'Fix crackling, muffled, or silent speakers and restore clear audio.', icon: `<path d="M4 9v6h3.5L12 19V5L7.5 9H4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` },
    { name: 'Microphone Repair', desc: 'Resolve call and voice-recording issues with precise mic repair.', icon: `<rect x="9" y="2.5" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` }
  ];

  const grid = document.getElementById('servicesGrid');
  if (grid) {
    grid.innerHTML = services.map((s, i) => `
      <div class="service-card reveal-up" style="--delay:${(i % 3) * 90}ms">
        <div class="service-icon">
          <svg viewBox="0 0 24 24" fill="none">${s.icon}</svg>
        </div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
      </div>
    `).join('');

    // Observe the freshly-created cards for reveal + stagger-in animation
    grid.querySelectorAll('.service-card').forEach(card => {
      revealObserver.observe(card);
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      cardObserver.observe(card);
    });
  }

  /* ---------------- Contact form validation ---------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    const validators = {
      name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
      phone: (v) => /^[0-9+\-\s()]{7,20}$/.test(v.trim()) || 'Enter a valid phone number.',
      message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
    };

    const showError = (field, msg) => {
      const input = form.elements[field];
      const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
      if (msg === true) {
        input.classList.remove('invalid');
        if (errorEl) errorEl.textContent = '';
        return true;
      }
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = msg;
      return false;
    };

    Object.keys(validators).forEach(field => {
      form.elements[field].addEventListener('input', () => {
        showError(field, validators[field](form.elements[field].value));
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMsg.classList.remove('show');

      let valid = true;
      Object.keys(validators).forEach(field => {
        const result = validators[field](form.elements[field].value);
        if (!showError(field, result)) valid = false;
      });

      if (!valid) return;

      // No backend configured — simulate a successful submission.
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 6000);
    });
  }

});
