/* ============================================
   PRESENTATION MODE — XI TJKT 2
   ============================================ */

(function() {
  'use strict';

  const container = document.getElementById('presContainer');
  const slides = document.querySelectorAll('.pres-slide');
  const dots = document.querySelectorAll('.pres-dot');
  const progressBar = document.getElementById('progressBar');
  const contents = document.querySelectorAll('.pres-content');

  let currentSlide = 0;
  let isScrolling = false;
  let scrollTimeout;
  const totalSlides = slides.length;

  // ==========================================
  // SCROLL TO SLIDE
  // ==========================================
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    const slide = slides[index];
    if (!slide) return;

    isScrolling = true;
    slide.scrollIntoView({ behavior: 'smooth', block: 'start' });
    currentSlide = index;
    updateIndicators();

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 800);
  }

  // ==========================================
  // UPDATE INDICATORS
  // ==========================================
  function updateIndicators() {
    // Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Progress bar
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    // Update slide accent color for dots
    const activeSlide = slides[currentSlide];
    if (activeSlide) {
      const accent = getComputedStyle(activeSlide).getPropertyValue('--slide-accent').trim();
      dots.forEach(dot => {
        if (dot.classList.contains('active')) {
          dot.style.background = accent || 'var(--c1)';
          dot.style.borderColor = accent || 'var(--c1)';
          dot.style.boxShadow = `0 0 10px -2px ${accent || 'var(--c1)'}`;
        } else {
          dot.style.background = '';
          dot.style.borderColor = '';
          dot.style.boxShadow = '';
        }
      });
    }
  }

  // ==========================================
  // SCROLL DETECTION (IntersectionObserver)
  // ==========================================
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(slides).indexOf(entry.target);
        if (index !== -1) {
          currentSlide = index;
          updateIndicators();
        }
      }
    });
  }, {
    root: container,
    threshold: 0.5
  });

  slides.forEach(slide => slideObserver.observe(slide));

  // ==========================================
  // CONTENT REVEAL ANIMATION
  // ==========================================
  const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    root: container,
    threshold: 0.15
  });

  contents.forEach(content => contentObserver.observe(content));

  // ==========================================
  // KEYBOARD NAVIGATION
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch(e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        goToSlide(currentSlide + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goToSlide(currentSlide - 1);
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  });

  // ==========================================
  // DOT NAVIGATION
  // ==========================================
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // ==========================================
  // TOUCH / SWIPE SUPPORT
  // ==========================================
  let touchStartY = 0;
  let touchEndY = 0;
  const swipeThreshold = 50;

  container.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  }, { passive: true });

  // ==========================================
  // WHEEL SCROLL PREVENTION (debounce)
  // ==========================================
  let wheelTimeout;
  container.addEventListener('wheel', (e) => {
    if (isScrolling) {
      e.preventDefault();
      return;
    }

    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  }, { passive: false });

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    updateIndicators();
    // Trigger reveal for first slide immediately
    setTimeout(() => {
      if (contents[0]) contents[0].classList.add('visible');
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
