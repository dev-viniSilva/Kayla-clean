/* ============================================================
   KAYLA'S CLEAN & SWEEP CO. — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAV SCROLL EFFECT ----------
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });


  // ---------- MOBILE BURGER MENU ----------
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ---------- INTERSECTION OBSERVER — FADE IN ----------
  const animatedEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatedEls.forEach(el => observer.observe(el));


  // ---------- COUNTER ANIMATION ----------
  const counters = document.querySelectorAll('.stat__num[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const value = Math.round(eased * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }


  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__links a:not(.nav__cta)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(section => sectionObserver.observe(section));


  // ---------- CONTACT FORM — FORMSPREE ----------
  // The form posts natively to Formspree via the action attribute in index.html.
  // Just replace YOUR_FORM_ID in the form's action="" with your real Formspree ID.
  // Formspree handles sending the email and redirecting after submission.
  // No JS needed here — everything works out of the box.
  //
  // Optional: add a loading state while the form submits
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
    });
  }


  // ---------- SMOOTH SCROLL OFFSET (for fixed nav) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ---------- HERO IMAGE PLACEHOLDER FALLBACK ----------
  document.querySelectorAll('.hero__img-wrap img, .why__img-wrap img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.hero__img-wrap, .why__img-wrap').classList.add('img--placeholder');
    });
  });

});