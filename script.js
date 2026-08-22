/* ============================================================
   UTOPIA DENTAL CLINIC — script.js
   JS vanilla, sans dépendance externe.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
     Année courante dans le footer
  ------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     Header : fond opaque au scroll
  ------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const toggleHeaderStyle = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  toggleHeaderStyle();
  window.addEventListener('scroll', toggleHeaderStyle, { passive: true });

  /* ------------------------------------------------------------
     Menu mobile : ouverture / fermeture
  ------------------------------------------------------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ------------------------------------------------------------
     Révélations au scroll (IntersectionObserver)
  ------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------
     Compteurs animés (note 4,9/5, 188+ avis...)
  ------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals).replace('.', ',') : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ------------------------------------------------------------
     Carrousel témoignages
  ------------------------------------------------------------ */
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  const scrollByCard = (direction) => {
    if (!track) return;
    const card = track.querySelector('.testimonial-card');
    if (!card) return;
    const gap = 24; // équivaut à gap-6
    const scrollAmount = card.offsetWidth + gap;
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }

  /* ------------------------------------------------------------
     Formulaire de contact — validation + confirmation simulée
  ------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nom = document.getElementById('nom');
      const telephone = document.getElementById('telephone');
      const message = document.getElementById('message');

      const showError = (input, condition) => {
        const errorEl = input.parentElement.querySelector('.field-error');
        if (condition) {
          input.classList.add('has-error');
          if (errorEl) errorEl.classList.remove('hidden');
          isValid = false;
        } else {
          input.classList.remove('has-error');
          if (errorEl) errorEl.classList.add('hidden');
        }
      };

      showError(nom, nom.value.trim().length < 2);

      const phonePattern = /^[0-9+\s]{9,}$/;
      showError(telephone, !phonePattern.test(telephone.value.trim()));

      showError(message, message.value.trim().length < 5);

      if (isValid) {
        successMsg.classList.remove('hidden');
        form.reset();
        setTimeout(() => successMsg.classList.add('hidden'), 6000);
      } else {
        successMsg.classList.add('hidden');
      }
    });
  }

});
