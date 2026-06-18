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

  function closeMobileMenu() {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }

  burger.addEventListener('click', () => {
    const opening = !navLinks.classList.contains('open');
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Scroll lock applies ONLY while the dropdown menu is open, and
    // is always paired with an unlock below, so it can never persist
    // and block scrolling on the rest of the page.
    document.body.style.overflow = opening ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      document.body.style.overflow = '';
    });
  });

  // Safety net: if the viewport is resized past the mobile
  // breakpoint while the menu is open, force-close it and release
  // the scroll lock so it can never get stuck.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
      closeMobileMenu();
      document.body.style.overflow = '';
    }
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
      const eased = 1 - Math.pow(1 - progress, 3);
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
  // Formspree owns the actual submit + redirect (native form action/
  // method, no preventDefault here). This handler ONLY shows a
  // "Sending…" state while the browser navigates away. No fade/animate
  // classes are touched, and the disabled state can never get stuck:
  // - on success, the browser navigates to Formspree's redirect/thank-you
  //   page, so this page (and its disabled button) goes away entirely
  // - on failure (offline, blocked request, validation fail before
  //   submit fires), the button is restored after a timeout so the
  //   user can fix the issue and try again
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (!btn || btn.disabled) return;

      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Safety net: if navigation hasn't happened (failed/offline
      // submit) within 8s, restore the button instead of leaving it
      // stuck forever.
      setTimeout(() => {
        if (document.body.contains(btn)) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      }, 8000);
    });
  }


  // ---------- SMOOTH SCROLL OFFSET (for fixed nav) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
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