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

  lenis.on('scroll', updateNavTheme);
  window.addEventListener('resize', updateNavTheme);
  updateNavTheme();
})();

// Scroll-spy + anchor links with Lenis
(function(){
  // Wire anchor links to Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href').replace('#','');
      const target = document.getElementById(id);
      if(target){ e.preventDefault(); lenis.scrollTo(target, {offset: -80}); }
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

// GSAP scroll-triggered reveals — subtle & professional
document.addEventListener('DOMContentLoaded', function(){
  gsap.registerPlugin(ScrollTrigger);

  // Sync ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Defaults
  const revealUp = { y: 32, opacity: 0 };
  const revealTo = { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' };

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

  // Feature grid scroll animation — replaced by feat-tabs React component

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
  gsap.from('.proof-inner', {
    y: 20, opacity: 0,
    scrollTrigger: { trigger: '.proof', start: 'top 90%' },
    duration: 0.7, ease: 'power2.out'
  });

  // Footer
  gsap.from('.foot-grid', {
    y: 24, opacity: 0,
    scrollTrigger: { trigger: 'footer', start: 'top 90%' },
    duration: 0.7, ease: 'power2.out'
  });

  // Timeline zig-zag rail animation
  (function(){
    var track = document.querySelector('.tl-track');
    var rail = document.querySelector('.tl-rail');
    var nodes = document.querySelectorAll('.tl-node');
    if(!track || !rail || !nodes.length) return;

    var state = null;

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

      /* nth-child(even) indents data-tl 0,2,4 (because .tl-rail is child 1)
         indented cards → farX (rail swings right toward them)
         non-indented   → nearX (rail stays moderate, card is already close)
         Pattern: arrive at card → linger vertically → sweep to next card */
      var nearX = isMobile ? 18 : 26;
      var farX  = isMobile ? 50 : 77;
      var startX = isMobile ? 4 : 5;

      /* Build waypoints: start → each card centre → bottom terminal.
         Catmull-Rom guarantees matching tangents at every waypoint → no kinks. */
      var pts = [];
      pts.push({ x: startX, y: 0 });
      for(var i = 0; i < ys.length; i++){
        var cx = (i % 2 === 0 ? farX : nearX);
        pts.push({ x: cx, y: ys[i] });
      }
      /* terminal: continue straight down from the last card */
      pts.push({ x: pts[pts.length - 1].x, y: trackH });

      /* Catmull-Rom → cubic bezier conversion.
         For each segment P[i]→P[i+1] the control points are:
           cp1 = P[i]   + (P[i+1] - P[i-1]) / 6
           cp2 = P[i+1] - (P[i+2] - P[i])   / 6
         Endpoints are clamped (ghost points = themselves). */
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
    }

    function apply(pct){
      if(!state) return;
      var offset = state.trainLen - (pct * state.len);
      state.trainPath.style.strokeDashoffset = offset;

      nodes.forEach(function(node, i){
        var threshold = state.ys[i] / state.trackH;
        var cls = '';
        if(pct >= threshold + 0.04) cls = 'is-past';
        else if(pct >= threshold - 0.06) cls = 'is-active';

        node.classList.remove('is-active','is-past');
        if(cls) node.classList.add(cls);
      });
    }

    build();

    var st = ScrollTrigger.create({
      trigger: track,
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: 0.3,
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

  // Hero — no scroll trigger, just entrance on load
  gsap.from('.hero h1', { y: 30, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.1 });
  gsap.from('.hero .lead', { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.25 });
  gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.4 });
  gsap.from('.hero-note', { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.55 });
  gsap.from('.hero-meta', { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.05 });
  gsap.from('.hero-vis', { y: 40, opacity: 0, scale: 0.97, duration: 1.1, ease: 'power2.out', delay: 0.3 });
});
