/* ============================================================
   LANDING.JS — Pondok Pesantren Al-Falah Putak
   Versi 3 — Enhanced UX & Mobile-First Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar: scrolled state ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 28);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Smooth page reveal on load ── */
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity .38s ease';
    document.body.style.opacity = '1';
  });

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Staggered group reveal ── */
  const groupEls = document.querySelectorAll('.reveal-group');
  if ('IntersectionObserver' in window) {
    const gObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          gObs.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    groupEls.forEach(el => gObs.observe(el));
  } else {
    groupEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Animated stat counters ── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const sObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el     = e.target;
          const target = parseInt(el.dataset.target, 10);
          const dur    = 1600;
          const start  = performance.now();
          const tick   = now => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target).toLocaleString('id');
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          sObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(el => sObs.observe(el));
  }

  /* ── Navbar: close mobile menu on link click ── */
  document
    .querySelectorAll('.navbar-nav .dropdown-item, .navbar-nav .nav-link:not(.dropdown-toggle)')
    .forEach(link => {
      link.addEventListener('click', () => {
        const nav = document.getElementById('navbarNav');
        if (nav?.classList.contains('show')) {
          bootstrap.Collapse.getInstance(nav)?.hide();
        }
      });
    });

  /* ── Navbar: desktop hover dropdown ── */
  if (window.innerWidth >= 992) {
    document.querySelectorAll('.nav-item.dropdown').forEach(item => {
      let timer;
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth < 992) return;
        clearTimeout(timer);
        item.classList.add('show');
        item.querySelector('.dropdown-menu')?.classList.add('show');
      });
      item.addEventListener('mouseleave', () => {
        if (window.innerWidth < 992) return;
        timer = setTimeout(() => {
          item.classList.remove('show');
          item.querySelector('.dropdown-menu')?.classList.remove('show');
        }, 100);
      });
    });
  }

  /* ── Active nav highlight ── */
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const currentHref = window.location.href;
  navLinks.forEach(link => {
    if (link.href === currentHref) {
      link.classList.add('active');
      const parentItem = link.closest('.nav-item')?.parentElement?.closest('.nav-item');
      if (parentItem) parentItem.querySelector('.nav-link')?.classList.add('active');
    }
  });

  /* ── Testimonial: 3D tilt on desktop ── */
  if (!isTouchDevice()) {
    document.querySelectorAll('.testimonial-card, .keunggulan-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - .5) * 7;
        const y = ((e.clientY - r.top)  / r.height - .5) * 7;
        card.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── Ripple effect on buttons ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - r.left - size/2}px;
        top:${e.clientY - r.top - size/2}px;
        background:rgba(255,255,255,.25);
        transform:scale(0); animation:ripple .5s ease-out;
        pointer-events:none; z-index:0;
      `;

      if (!document.querySelector('#ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
        document.head.appendChild(s);
      }

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 520);
    });
  });

  /* ── Touch swipe feedback on cards ── */
  if (isTouchDevice()) {
    document.querySelectorAll('.activities-card, .facility-card, .keunggulan-card').forEach(card => {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(.98)';
        card.style.transition = 'transform .12s ease';
      }, { passive: true });
      card.addEventListener('touchend', () => {
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 200);
      }, { passive: true });
    });
  }

  /* ── Smooth image loading ── */
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity .4s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '1'; });
    }
  });

  /* ── Helper ── */
  function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

})();