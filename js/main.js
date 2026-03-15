/* ========================================
   楽々ウェディング招待状 - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initOpeningOverlay();
  initNavigation();
  initCountdown();
  initScrollAnimations();
  initParticles();
  initRSVPForm();
});

/* ─── Opening Overlay ─── */
function initOpeningOverlay() {
  const overlay = document.getElementById('opening-overlay');
  const btn = document.getElementById('open-invitation-btn');

  if (!overlay || !btn) return;

  // Prevent scrolling while overlay is visible
  document.body.style.overflow = 'hidden';

  btn.addEventListener('click', () => {
    overlay.classList.add('is-hidden');
    document.body.style.overflow = '';

    // Remove from DOM after animation
    setTimeout(() => {
      overlay.remove();
    }, 1000);
  });
}

/* ─── Navigation ─── */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let lastScrollY = 0;
  let navShown = false;

  // Show nav after scroll past hero
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero')?.offsetHeight || 600;

    if (scrollY > heroHeight * 0.7) {
      if (!navShown) {
        nav.classList.add('is-visible');
        navShown = true;
      }
    } else {
      if (navShown) {
        nav.classList.remove('is-visible');
        mobileMenu?.classList.remove('is-open');
        toggle?.classList.remove('is-active');
        navShown = false;
      }
    }

    lastScrollY = scrollY;
  });

  // Mobile menu toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
    });

    // Close mobile menu when link clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = nav.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ─── Countdown Timer ─── */
function initCountdown() {
  // Wedding date: 2026-10-10 11:00 JST
  const weddingDate = new Date('2026-10-10T11:00:00+09:00').getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl) return;

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ─── Scroll Animations (Intersection Observer) ─── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add staggered delay for children
          const delay = entry.target.style.animationDelay || '0s';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

/* ─── Floating Particles ─── */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('hero-particle');

    const x = Math.random() * 100;
    const size = 2 + Math.random() * 4;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 10;
    const opacity = 0.2 + Math.random() * 0.5;

    particle.style.cssText = `
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(particle);
  }
}

/* ─── RSVP Form ─── */
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('rsvp-success');
  const submitBtn = document.getElementById('rsvp-submit');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const companionGroup = document.getElementById('companion-group');

  if (!form) return;

  // Show/hide companion field based on attendance
  attendanceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (companionGroup) {
        if (radio.value === 'attend' && radio.checked) {
          companionGroup.style.display = 'block';
          companionGroup.style.animation = 'fadeInScale 0.3s ease forwards';
        } else if (radio.value === 'decline' && radio.checked) {
          companionGroup.style.display = 'none';
        }
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

    // Validate
    let isValid = true;

    // Name validation
    const nameInput = document.getElementById('guest-name');
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Attendance validation
    const attendance = form.querySelector('input[name="attendance"]:checked');
    if (!attendance) {
      document.querySelector('.radio-group').closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate submission
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      // Collect form data (for future API integration)
      const formData = {
        name: nameInput.value.trim(),
        attendance: attendance.value,
        companions: document.getElementById('companions')?.value || '0',
        allergy: document.getElementById('allergy')?.value.trim() || '',
        message: document.getElementById('message')?.value.trim() || '',
        submittedAt: new Date().toISOString()
      };

      // Log form data (for development)
      console.log('RSVP Response:', formData);

      // Save to localStorage as backup
      try {
        const existing = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
        existing.push(formData);
        localStorage.setItem('rsvp_responses', JSON.stringify(existing));
      } catch (err) {
        console.error('Failed to save RSVP response:', err);
      }

      // Show success
      form.style.display = 'none';
      successEl.style.display = 'block';
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }, 1500);
  });
}
