(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    // Scroll reveal via IntersectionObserver
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Trigger counter animations if any inside
            var counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(animateCounter);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function(el){ io.observe(el); });

      // Also observe standalone counters
      var soloCounters = document.querySelectorAll('[data-count]');
      var counterIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      soloCounters.forEach(function(el){ counterIO.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
    }

    function animateCounter(el){
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var duration = 1200;
      var start = performance.now();
      var isInt = Number.isInteger(target);
      function tick(now){
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = prefix + (isInt ? Math.round(val).toLocaleString() : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if (id.length > 1) {
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Navbar scroll state
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function(){
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile menu toggle
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function(){
        menu.classList.toggle('open');
      });
    }

    // Cursor-follower glow on hero (desktop only)
    var hero = document.querySelector('.hero');
    var glow = document.querySelector('.hero-cursor-glow');
    if (hero && glow && window.matchMedia('(hover:hover)').matches && window.innerWidth >= 1024) {
      hero.addEventListener('mousemove', function(e){
        var rect = hero.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        glow.style.opacity = '1';
      });
      hero.addEventListener('mouseleave', function(){ glow.style.opacity = '0'; });
    }

    // Staggered hero word reveal
    var heroWords = document.querySelectorAll('.hero .word');
    heroWords.forEach(function(w, i){
      w.style.animationDelay = (80 * i) + 'ms';
    });

  });
})();
