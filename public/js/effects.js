(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Page load ── */
  function initPageLoad() {
    document.body.classList.add('loaded');
    document.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.setProperty('--delay', `${i * 0.1}s`);
    });
  }

  /* ── Cursor glow follow ── */
  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || prefersReducedMotion) return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
    });

    function animate() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      glow.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── Button ripple ── */
  function initRipple() {
    document.querySelectorAll('.btn, .site-nav a, .logo').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        if (prefersReducedMotion) return;
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* ── 3D card tilt ── */
  function initTilt() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Input focus glow trail ── */
  function initInputEffects() {
    document.querySelectorAll('.form-group input').forEach((input) => {
      input.addEventListener('focus', () => {
        input.closest('.form-group')?.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        input.closest('.form-group')?.classList.remove('focused');
        if (input.value) input.closest('.form-group')?.classList.add('filled');
        else input.closest('.form-group')?.classList.remove('filled');
      });
      if (input.value) input.closest('.form-group')?.classList.add('filled');
    });
  }

  /* ── Password toggle ── */
  function initPasswordToggle() {
    document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.querySelector(btn.dataset.togglePassword);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.classList.toggle('visible', isPassword);
        btn.setAttribute('aria-label', isPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
      });
    });
  }

  /* ── Form submit loading ── */
  function initFormLoading() {
    document.querySelectorAll('form.auth-form, form.nav-logout, .dashboard-actions form').forEach((form) => {
      form.addEventListener('submit', () => {
        const btn = form.querySelector('[type="submit"]');
        if (btn && !btn.classList.contains('loading')) {
          btn.classList.add('loading');
          btn.dataset.originalText = btn.textContent;
          btn.textContent = 'กำลังดำเนินการ...';
          btn.disabled = true;
        }
      });
    });
  }

  /* ── Shake alert on error ── */
  function initErrorShake() {
    document.querySelectorAll('.alert-error').forEach((alert) => {
      alert.classList.add('shake');
    });
  }

  /* ── Scroll reveal ── */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  /* ── Typing effect for hero ── */
  function initTyping() {
    const el = document.querySelector('[data-typing]');
    if (!el || prefersReducedMotion) return;

    const text = el.dataset.typing;
    const speed = 60;
    let i = 0;
    el.textContent = '';

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        setTimeout(type, speed);
      } else {
        el.classList.add('done');
      }
    }
    setTimeout(type, 600);
  }

  /* ── Counter animation ── */
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      let current = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 40);
    });
  }

  /* ── Nav active link ── */
  function initActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.site-nav a[href]').forEach((link) => {
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
      }
    });
  }

  /* ── Header scroll shrink ── */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPageLoad();
    initCursorGlow();
    initRipple();
    initTilt();
    initInputEffects();
    initPasswordToggle();
    initFormLoading();
    initErrorShake();
    initScrollReveal();
    initTyping();
    initCounters();
    initActiveNav();
    initHeaderScroll();
  });
})();
