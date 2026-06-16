// Lenis smooth scroll — buttery, no snap
(function(){
  var lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
})();

// Mobile nav toggle
(function(){
  var nav    = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var menu   = document.querySelector('.nav-mobile-menu');
  if(!toggle || !menu) return;

  function openMenu(){
    nav.classList.add('nav--open');
    toggle.setAttribute('aria-expanded','true');
    menu.removeAttribute('aria-hidden');
  }
  function closeMenu(){
    nav.classList.remove('nav--open');
    toggle.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-hidden','true');
  }

  toggle.addEventListener('click', function(){
    nav.classList.contains('nav--open') ? closeMenu() : openMenu();
  });

  // Close on any menu link click
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function(e){
    if(nav.classList.contains('nav--open') && !nav.contains(e.target)) closeMenu();
  });
})();

// Nav theme — switches to light text when over dark sections
(function(){
  var nav          = document.querySelector('.nav');
  var darkSections = document.querySelectorAll('[data-nav-theme="dark"]');
  if(!nav || !darkSections.length) return;

  function updateNavTheme(){
    var navBottom = nav.getBoundingClientRect().bottom;
    var isDark = false;
    darkSections.forEach(function(s){
      var r = s.getBoundingClientRect();
      if(r.top <= navBottom && r.bottom >= 0) isDark = true;
    });
    nav.classList.toggle('nav--on-dark', isDark);
  }

  window.addEventListener('scroll', updateNavTheme, {passive:true});
  window.addEventListener('resize', updateNavTheme);
  updateNavTheme();
})();

// Scroll-spy + anchor links (native smooth scroll)
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href').replace('#','');
      e.preventDefault();
      if(!id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.getElementById(id);
        if(target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  const links = document.querySelectorAll('.nav-links a');
  const sections = [];
  links.forEach(a => {
    const id = a.getAttribute('href').replace('#','');
    const el = document.getElementById(id);
    if(el) sections.push({el, a});
  });
  function update(){
    let current = sections[0];
    const off = window.scrollY + 120;
    for(const s of sections){
      if(s.el.offsetTop <= off) current = s;
    }
    links.forEach(a => a.classList.remove('active'));
    if(current) current.a.classList.add('active');
  }
  window.addEventListener('scroll', update, {passive:true});
  update();
})();

// GSAP scroll-triggered reveals
document.addEventListener('DOMContentLoaded', function(){
  gsap.registerPlugin(ScrollTrigger);

  // Defaults
  const revealUp = { y: 32, opacity: 0 };

  // Section headings
  gsap.utils.toArray('.sec-head, .cta .eyebrow, .cta .display, .cta .lead, .cta .hero-cta').forEach(function(el){
    gsap.from(el, Object.assign({}, revealUp, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      duration: 0.8, ease: 'power2.out'
    }));
  });

  // Pillar cards — staggered
  gsap.utils.toArray('.pillars').forEach(function(grid){
    gsap.from(grid.children, Object.assign({}, revealUp, {
      scrollTrigger: { trigger: grid, start: 'top 85%' },
      duration: 0.7, ease: 'power2.out', stagger: 0.1
    }));
  });

  // Dashboard mockups — slight scale + fade
  gsap.utils.toArray('.device-mac').forEach(function(el){
    gsap.from(el, {
      y: 40, opacity: 0, scale: 0.97,
      scrollTrigger: { trigger: el, start: 'top 85%' },
      duration: 1, ease: 'power2.out'
    });
  });

  // Showcase checks list
  gsap.utils.toArray('.checks li').forEach(function(el, i){
    gsap.from(el, Object.assign({}, revealUp, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      duration: 0.6, ease: 'power2.out', delay: i * 0.08
    }));
  });

  // Sector strip
  gsap.utils.toArray('.sector').forEach(function(el, i){
    gsap.from(el, Object.assign({}, revealUp, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      duration: 0.5, ease: 'power2.out', delay: i * 0.06
    }));
  });

  // Phone mockups in mobile suite
  gsap.utils.toArray('.phone-real').forEach(function(el){
    gsap.from(el, {
      y: 50, opacity: 0, scale: 0.95,
      scrollTrigger: { trigger: el, start: 'top 88%' },
      duration: 1, ease: 'power2.out'
    });
  });

  // Suite features
  gsap.utils.toArray('.suite-feat').forEach(function(el, i){
    gsap.from(el, Object.assign({}, revealUp, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      duration: 0.6, ease: 'power2.out', delay: i * 0.08
    }));
  });

  // Proof strip
  var proofInner = document.querySelector('.proof-inner');
  if (proofInner) {
    gsap.from(proofInner, {
      y: 20, opacity: 0,
      scrollTrigger: { trigger: '.proof', start: 'top 90%' },
      duration: 0.7, ease: 'power2.out'
    });
  }

  // Footer
  var footTop = document.querySelector('.foot-top');
  if (footTop) {
    gsap.from(footTop, {
      y: 24, opacity: 0,
      scrollTrigger: { trigger: 'footer', start: 'top 90%' },
      duration: 0.7, ease: 'power2.out'
    });
  }

  // Timeline zig-zag rail animation
  (function(){
    var track = document.querySelector('.tl-track');
    var rail = document.querySelector('.tl-rail');
    var nodes = document.querySelectorAll('.tl-node');
    if(!track || !rail || !nodes.length) return;

    var state = null;
    var nodeStates = [];

    function build(){
      var trackRect = track.getBoundingClientRect();
      var trackH = trackRect.height || 1;
      var isMobile = window.innerWidth <= 640;
      var railW = isMobile ? 60 : 84;

      var ys = Array.prototype.map.call(nodes, function(node){
        var ico = node.querySelector('.tl-ico') || node.querySelector('.tl-card') || node;
        var r = ico.getBoundingClientRect();
        return (r.top - trackRect.top) + r.height / 2;
      });

      var nearX = isMobile ? 18 : 26;
      var farX  = isMobile ? 50 : 77;
      var startX = isMobile ? 4 : 5;

      var pts = [];
      pts.push({ x: startX, y: 0 });
      for(var i = 0; i < ys.length; i++){
        var cx = (i % 2 === 0 ? farX : nearX);
        pts.push({ x: cx, y: ys[i] });
      }
      pts.push({ x: pts[pts.length - 1].x, y: trackH });

      var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for(var si = 1; si < pts.length; si++){
        var p0 = pts[Math.max(0, si - 2)];
        var p1 = pts[si - 1];
        var p2 = pts[si];
        var p3 = pts[Math.min(pts.length - 1, si + 1)];
        var cp1x = p1.x + (p2.x - p0.x) / 6;
        var cp1y = p1.y + (p2.y - p0.y) / 6;
        var cp2x = p2.x - (p3.x - p1.x) / 6;
        var cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ' C' + cp1x.toFixed(1) + ' ' + cp1y.toFixed(1)
           + ' '  + cp2x.toFixed(1) + ' ' + cp2y.toFixed(1)
           + ' '  + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
      }

      var trainLen = 30;

      rail.innerHTML = ''
        + '<svg class="tl-rail-svg" width="' + railW + '" height="' + trackH
        + '" viewBox="0 0 ' + railW + ' ' + trackH + '" aria-hidden="true">'
        +   '<path class="tl-rail-track" d="' + d + '"/>'
        +   '<path class="tl-rail-train" d="' + d + '"/>'
        + '</svg>';

      var trackPath = rail.querySelector('.tl-rail-track');
      var trainPath = rail.querySelector('.tl-rail-train');
      var len = trackPath.getTotalLength();
      trainPath.style.strokeDasharray = trainLen + ' ' + (len + trainLen);
      trainPath.style.strokeDashoffset = trainLen;

      state = {
        trackPath: trackPath,
        trainPath: trainPath,
        len: len,
        trainLen: trainLen,
        ys: ys,
        trackH: trackH
      };
      nodeStates = Array.prototype.map.call(nodes, function(){ return ''; });
    }

    function apply(pct){
      if(!state) return;
      var offset = state.trainLen - (pct * (state.len + 2 * state.trainLen));
      state.trainPath.style.strokeDashoffset = offset;

      nodes.forEach(function(node, i){
        var threshold = state.ys[i] / state.trackH;
        var cls = '';
        if(pct >= threshold + 0.04) cls = 'is-past';
        else if(pct >= threshold - 0.06) cls = 'is-active';

        if(cls !== nodeStates[i]){
          node.classList.remove('is-active','is-past');
          if(cls) node.classList.add(cls);
          nodeStates[i] = cls;
        }
      });
    }

    build();

    var st = ScrollTrigger.create({
      trigger: track,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: function(self){ apply(self.progress); }
    });

    var rebuildTimer;
    window.addEventListener('resize', function(){
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(function(){
        build();
        apply(st.progress);
        ScrollTrigger.refresh();
      }, 120);
    });
  })();

  // Hero — entrance on load
  gsap.from('.hero h1', { y: 30, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.1 });
  gsap.from('.hero .lead', { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.25 });
  gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.4 });
  gsap.from('.hero-note', { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.55 });
  gsap.from('.hero-meta', { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.05 });
  gsap.from('.hero-vis', { y: 40, opacity: 0, scale: 0.97, duration: 1.1, ease: 'power2.out', delay: 0.3 });
});
