document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('main section[id]');
  const typedTitle = document.getElementById('typed-title');
  const timestamp = document.getElementById('last-updated');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const currentYear = document.querySelector('[data-current-year]');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const setTimestamp = () => {
    if (!timestamp) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    timestamp.textContent = `Updated ${timeString}`;
  };

  const typeWriter = () => {
    if (!typedTitle) return;

    const phrases = [
      'Securing digital systems with proactive defense.',
      'Monitoring threats before they become incidents.',
      'Building resilient security operations for modern teams.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex += 1;
        typedTitle.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(tick, 1200);
          return;
        }
      } else {
        charIndex -= 1;
        typedTitle.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      const speed = isDeleting ? 35 : 70;
      setTimeout(tick, speed);
    };

    tick();
  };

  const updateActiveNav = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const scrollPosition = window.scrollY + 180;
    let activeId = 'about';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isPageLink = href && !href.startsWith('#') && href !== 'javascript:void(0)';
      const matchesSection = href === `#${activeId}`;
      const matchesPage = isPageLink && href === path;
      const matchesHome = !href.startsWith('#') && href === 'index.html' && path === 'index.html';

      link.classList.toggle('active', matchesSection || matchesPage || matchesHome);
    });
  };

  const animateCounter = (element) => {
    const rawValue = Number(element.dataset.counter || 0);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 1200;
    const startTime = performance.now();

    const formatValue = (value) => {
      if (Number.isInteger(rawValue)) {
        return `${Math.round(value)}${suffix}`;
      }

      return `${value.toFixed(1)}${suffix}`;
    };

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = rawValue * eased;
      element.textContent = `${prefix}${formatValue(currentValue)}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const setupCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));
  };

  const setupRevealEffects = () => {
    const revealTargets = document.querySelectorAll('.case-card, .timeline-item, .cert-card, .project-card, .info-card, .contact-card, .section-heading, .hero-copy, .hero-panel');

    if (!revealTargets.length) return;

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      revealObserver.observe(target);
    });
  };

  const setupMobileNav = () => {
    if (!navToggle || !mainNav) return;

    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          mainNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  const setupHeroTilt = () => {
    const heroPanel = document.querySelector('.hero-panel');
    if (!heroPanel) return;

    heroPanel.addEventListener('pointermove', (event) => {
      const rect = heroPanel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      heroPanel.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroPanel.addEventListener('pointerleave', () => {
      heroPanel.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
    });
  };

  setTimestamp();
  typeWriter();
  updateActiveNav();
  setupCounters();
  setupRevealEffects();
  setupMobileNav();
  setupHeroTilt();

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  setInterval(setTimestamp, 60000);
});
