/* ============================================================
   EVERHAVEN — interactions
   - Scroll-reveal via IntersectionObserver
   - Capabilities filter
   - File-drop visual feedback
   - Video background fade
   ============================================================ */

(function () {
  'use strict';

  /* ----- Scroll reveal ----- */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade');
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ----- Capabilities filter ----- */
  const catFilters = document.querySelectorAll('.cap-filter');
  const matFilters = document.querySelectorAll('.cap-filter-mat');
  const cards      = document.querySelectorAll('.cap-card');

  if (cards.length) {
    let activeCat = 'all';
    let activeMat = 'all';

    function applyFilters() {
      cards.forEach((card) => {
        const catMatch = activeCat === 'all' || card.dataset.cat === activeCat;
        const matMatch = activeMat === 'all' || card.dataset.mat === activeMat;
        card.style.display = (catMatch && matMatch) ? '' : 'none';
      });
    }

    catFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCat = btn.dataset.cat;
        catFilters.forEach((b) => b.classList.toggle('is-active', b === btn));
        applyFilters();
      });
    });

    matFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeMat = btn.dataset.mat;
        matFilters.forEach((b) => b.classList.toggle('is-active', b === btn));
        applyFilters();
      });
    });
  }

  /* ----- File-drop visual feedback ----- */
  const drop = document.querySelector('.file-drop');
  const input = document.getElementById('file-in');

  if (drop && input) {
    ['dragenter', 'dragover'].forEach((evt) =>
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        drop.style.borderColor = 'var(--accent)';
        drop.style.background = 'var(--bg)';
      })
    );
    ['dragleave', 'drop'].forEach((evt) =>
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        drop.style.borderColor = '';
        drop.style.background = '';
      })
    );
    drop.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        updateDropLabel(e.dataTransfer.files);
      }
    });
    input.addEventListener('change', () => updateDropLabel(input.files));

    function updateDropLabel(files) {
      const label = drop.querySelector('.drop-label');
      const hint = drop.querySelector('.drop-hint');
      if (files && files.length) {
        const names = Array.from(files)
          .map((f) => f.name)
          .slice(0, 3)
          .join(', ');
        const extra = files.length > 3 ? ` + ${files.length - 3} more` : '';
        label.textContent = `✓  ${files.length} file${files.length === 1 ? '' : 's'} attached`;
        hint.textContent = names + extra;
      }
    }
  }

  /* ----- Material accordion ----- */
  document.querySelectorAll('.mat-header').forEach(function (el) {
    function toggle() {
      const detail = el.closest('.mat-detail');
      const isOpen = detail.classList.toggle('is-open');
      el.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ----- Process accordion ----- */
  document.querySelectorAll('.proc-header').forEach(function (el) {
    function toggle() {
      const detail = el.closest('.process-detail');
      const isOpen = detail.classList.toggle('is-open');
      el.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ----- Mobile nav toggle ----- */
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----- Back-to-top button ----- */
  const topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('is-visible', window.scrollY > 400);
    });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Video background fade ----- */
  const bg   = document.getElementById('page-video-bg');
  const zone = document.getElementById('video-zone');

  if (bg && zone) {
    const io = new IntersectionObserver(
      (entries) => {
        bg.classList.toggle('is-active', entries[0].isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(zone);
  }

})();
