/* ============================================================
   InAmigos Foundation — script.js
   Handles: Navbar scroll, Mobile menu, Scroll reveal,
            Interest tabs, Form submission, Notification
   ============================================================ */

/* ── 1. NAVBAR: scroll class + active link highlighting ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on section in view
    const sections = document.querySelectorAll('section[id], .impact-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── 2. HAMBURGER / MOBILE MENU ── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animate the three bars into X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when any link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });
})();


/* ── 3. SCROLL REVEAL (IntersectionObserver) ── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.active)')
          );
          const idx = siblings.indexOf(entry.target);
          const delay = idx >= 0 ? idx * 80 : 0;

          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ── 4. CAUSE CARDS: click ripple + subtle tilt on mousemove ── */
(function initCauseCards() {
  const cards = document.querySelectorAll('.cause-card');

  cards.forEach(card => {
    // Tilt effect
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    // Ripple on click
    card.addEventListener('click', e => {
      const existing = card.querySelector('.ripple');
      if (existing) existing.remove();

      const rect   = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;

      Object.assign(ripple.style, {
        position:      'absolute',
        width:         size + 'px',
        height:        size + 'px',
        left:          (e.clientX - rect.left - size / 2) + 'px',
        top:           (e.clientY - rect.top  - size / 2) + 'px',
        borderRadius:  '50%',
        background:    'rgba(194,101,74,0.15)',
        transform:     'scale(0)',
        animation:     'rippleAnim 0.6s ease-out forwards',
        pointerEvents: 'none',
        zIndex:        '10',
      });

      ripple.classList.add('ripple');
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ── 5. INTEREST TABS (contact form) ── */
(function initInterestTabs() {
  const tabs   = document.querySelectorAll('.i-tab');
  const hidden = document.getElementById('interest-hidden');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (hidden) hidden.value = tab.dataset.interest;
    });
  });
})();


/* ── 6. CONTACT FORM SUBMISSION + NOTIFICATION ── */
(function initContactForm() {
  const form   = document.getElementById('impact-form');
  const notify = document.getElementById('notify');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation: check all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--terra)';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate submit: disable button, show spinner
    const btn  = form.querySelector('.btn-submit');
    const span = btn.querySelector('span');
    const originalText = span.textContent;

    btn.disabled        = true;
    span.textContent    = 'Sending…';
    btn.style.opacity   = '0.7';

    // Simulate async delay (replace with real fetch if needed)
    setTimeout(() => {
      // Reset form
      form.reset();

      // Restore button
      btn.disabled      = false;
      span.textContent  = originalText;
      btn.style.opacity = '';

      // Show notification
      showNotification();
    }, 1400);
  });

  function showNotification() {
    if (!notify) return;
    notify.classList.add('show');
    setTimeout(() => notify.classList.remove('show'), 4000);
  }
})();


/* ── 7. NEWSLETTER FORM (footer) ── */
(function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;

    const btn = form.querySelector('button');
    btn.style.background = 'var(--sage)';

    // Show a small tick icon
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    setTimeout(() => {
      input.value        = '';
      btn.style.background = '';
      btn.innerHTML = '<i data-lucide="arrow-right"></i>';
      // Re-init lucide for new icon
      if (window.lucide) lucide.createIcons();
    }, 2500);
  });
})();


/* ── 8. GALLERY: lightbox-style zoom on click ── */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox elements
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:        'fixed',
    inset:           '0',
    background:      'rgba(15,30,20,0.92)',
    zIndex:          '9998',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    opacity:         '0',
    transition:      'opacity 0.35s ease',
    cursor:          'zoom-out',
    backdropFilter:  'blur(8px)',
  });

  const lightboxImg = document.createElement('img');
  Object.assign(lightboxImg.style, {
    maxWidth:        'min(90vw, 1000px)',
    maxHeight:       '85vh',
    borderRadius:    '16px',
    boxShadow:       '0 40px 80px rgba(0,0,0,0.5)',
    transform:       'scale(0.92)',
    transition:      'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    objectFit:       'contain',
  });

  const closeBtn = document.createElement('button');
  Object.assign(closeBtn.style, {
    position:   'absolute',
    top:        '1.5rem',
    right:      '1.5rem',
    background: 'rgba(255,255,255,0.1)',
    border:     '1px solid rgba(255,255,255,0.2)',
    borderRadius:'50%',
    width:      '44px',
    height:     '44px',
    color:      '#fff',
    fontSize:   '1.3rem',
    cursor:     'pointer',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1',
    transition: 'background 0.2s',
  });
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(255,255,255,0.2)');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,0.1)');

  overlay.appendChild(lightboxImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    document.body.style.overflow = 'hidden';
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    });
  }

  function closeLightbox() {
    overlay.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.92)';
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 350);
  }

  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);

  // Keyboard: Escape to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();


/* ── 9. IMPACT NUMBERS: count-up animation ── */
(function initCountUp() {
  const numEls = document.querySelectorAll('.impact-num');
  if (!numEls.length) return;

  function parseNumber(str) {
    // Extract numeric value and suffix (e.g. "20,000+" → { val: 20000, suffix: "+" })
    const clean  = str.replace(/,/g, '');
    const match  = clean.match(/^([\d.]+)([^0-9.]*)$/);
    if (!match) return null;
    return { val: parseFloat(match[1]), suffix: match[2] || '', original: str };
  }

  function formatNumber(val, original) {
    // Restore commas if original had them
    if (original.includes(',')) {
      return Math.round(val).toLocaleString('en-IN');
    }
    return Math.round(val).toString();
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el      = entry.target;
      const parsed  = parseNumber(el.textContent);
      if (!parsed) return;

      const { val, suffix, original } = parsed;
      const duration = 1800;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * val;
        el.textContent = formatNumber(current, original) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  numEls.forEach(el => observer.observe(el));
})();


/* ── 10. SMOOTH ANCHOR SCROLL (with navbar offset) ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH   = document.getElementById('navbar')?.offsetHeight || 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 11. ACTIVE NAV LINK STYLE injection ── */
(function injectActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      background: var(--cream-dk);
      color: var(--forest);
    }
  `;
  document.head.appendChild(style);
})();


/* ── 12. LUCIDE ICONS: initialise after DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});