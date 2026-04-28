/* ============================================
   LUXURY REAL ESTATE - GLOBAL SCRIPTS
============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- NAVBAR SCROLL EFFECT ---- */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const toggleNav = () => {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', toggleNav, { passive: true });
    toggleNav();
  }

  /* ---- HERO BG PARALLAX ZOOM ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    setTimeout(() => document.querySelector('.hero-section')?.classList.add('loaded'), 100);
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  }

  /* ---- BACK TO TOP ---- */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current < target) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
      };
      requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.classList.contains('counted')) {
          e.target.classList.add('counted');
          animateCounter(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  /* ---- PROPERTY FILTER (Properties page) ---- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        filterItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.animation = 'fadeUp 0.5s ease both';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- GALLERY LIGHTBOX (Property Details) ---- */
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (galleryItems.length) {
    galleryItems.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed;inset:0;background:rgba(0,0,0,0.92);
          display:flex;align-items:center;justify-content:center;
          z-index:99999;cursor:zoom-out;animation:fadeIn 0.3s ease;
        `;
        const image = document.createElement('img');
        image.src = this.src;
        image.alt = this.alt;
        image.style.cssText = 'max-width:90vw;max-height:88vh;object-fit:contain;border-radius:4px;';
        const close = document.createElement('button');
        close.innerHTML = '&times;';
        close.style.cssText = `
          position:absolute;top:20px;right:28px;background:none;border:none;
          color:#fff;font-size:2.5rem;cursor:pointer;line-height:1;opacity:0.8;
        `;
        close.onmouseover = () => close.style.opacity = '1';
        close.onmouseout = () => close.style.opacity = '0.8';
        overlay.appendChild(image);
        overlay.appendChild(close);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        const dismiss = () => {
          overlay.remove();
          document.body.style.overflow = '';
        };
        overlay.addEventListener('click', dismiss);
        close.addEventListener('click', dismiss);
      });
    });
  }

  /* ---- FORM VALIDATION (Inquiry/Contact) ---- */
  const forms = document.querySelectorAll('.needs-validate');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const btn = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#1a7a4a,#27ae60)';
        form.reset();
        form.classList.remove('was-validated');
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      }, 1200);
    });
  });

  /* ---- SMOOTH INTERNAL LINK SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- SCROLL REVEAL (fallback if AOS not loaded) ---- */
  if (typeof AOS === 'undefined') {
    const reveals = document.querySelectorAll('[data-aos]');
    if (reveals.length) {
      const revObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            revObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        revObs.observe(el);
      });
    }
  }

  /* ---- ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

});
