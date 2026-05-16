(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    // Intersection observer for reveal classes
    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .stagger, .hairline-draw');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
    }

    // Sticky header scrolled state
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function(){
        if (window.scrollY > 40) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile nav toggle
    var navToggle = document.querySelector('.nav-toggle');
    var navMobile = document.querySelector('.nav-mobile');
    if (navToggle && navMobile) {
      navToggle.addEventListener('click', function(){
        navMobile.classList.toggle('is-open');
      });
    }

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // FAQ toggles
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', function(){
        item.classList.toggle('is-open');
      });
    });

    // Number counter animation
    function animateCounter(el){
      var target = parseFloat(el.getAttribute('data-count') || el.textContent);
      if (isNaN(target)) return;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = performance.now();
      function tick(now){
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        var value = target * eased;
        var display = (target % 1 === 0) ? Math.round(value).toString() : value.toFixed(1);
        el.textContent = prefix + display + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    var counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && counters.length) {
      var co = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            co.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function(el){ co.observe(el); });
    }

    // Current year in footer
    var yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

  });
})();
