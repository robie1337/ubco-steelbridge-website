/* ---- 🍄 Hi, fellow engineer. ---- */
(function(){try{console.log('%c UBCO Steel Bridge ','background:#0a1628;color:#7ab4e8;font:bold 14px sans-serif;padding:4px 8px;border-radius:2px;');console.log('%c Built in Kelowna. Red & green hats since 2024. ','color:#7ab4e8;font:12px sans-serif;');}catch(e){}})();
(function() {
  /* Force scroll to top on load — prevents browser restoring mid-page position */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  var PANELS = ['home','about','process','team','events','sponsors','contact'];
  var current = 'home';

  function showPanel(id) {
    if (!PANELS.includes(id) || id === current) return;
    document.getElementById('p-' + current).classList.remove('visible');
    current = id;
    document.querySelectorAll('[data-panel]').forEach(function(el) {
      el.classList.toggle('active', el.dataset.panel === id);
    });
    /* Instant scroll to top — bypass smooth scrolling */
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    requestAnimationFrame(function(){ document.documentElement.style.scrollBehavior = 'smooth'; });
    document.getElementById('p-' + id).classList.add('visible');
    if (id === 'team')     observeCards('#p-team .t-card');
    if (id === 'sponsors') observeCards('.spon-card');
    if (id === 'home')     { countersFired = false; document.querySelectorAll('.stat-n[data-to]').forEach(function(el){ el.textContent = '0'; }); runCounters(); observeAnims(); observeCards('.ed-photo-wrap'); }
    if (id === 'events')   observeCards('.gal-cell');
    closeMenu();
  }

  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-panel]');
    if (el) { showPanel(el.dataset.panel); return; }
    if (e.target.closest('.btn-go[data-go]')) { showPanel(e.target.closest('[data-go]').dataset.go); return; }
    if (e.target.closest('.sp-join-btn')) { showPanel('contact'); return; }
  });

  document.getElementById('logo-home').addEventListener('click', function() { showPanel('home'); });

  document.querySelectorAll('.ev-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ev-season').forEach(function(s) { s.classList.remove('active'); });
      document.querySelectorAll('.ev-tab').forEach(function(b) { b.classList.remove('active'); });
      document.getElementById('ev-' + btn.dataset.season).classList.add('active');
      btn.classList.add('active');
      document.querySelectorAll('#ev-' + btn.dataset.season + ' .gal-cell').forEach(function(c){ c.classList.add('in-view'); });
    });
  });
  document.querySelectorAll('.tm-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tm-season').forEach(function(s) { s.classList.remove('active'); });
      document.querySelectorAll('.tm-tab').forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      document.getElementById('tm-' + btn.dataset.season).classList.add('active');
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      // Re-trigger card entry animation for the newly shown season
      document.querySelectorAll('#tm-' + btn.dataset.season + ' .t-card').forEach(function(c) { c.classList.add('in-view'); });
    });
  });

  var overlay = document.getElementById('overlay');
  function openMenu() { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; document.getElementById('burger-btn').setAttribute('aria-expanded','true'); }
  function closeMenu() { overlay.classList.remove('open'); document.body.style.overflow = ''; document.getElementById('burger-btn').setAttribute('aria-expanded','false'); }
  document.getElementById('burger-btn').addEventListener('click', openMenu);
  document.getElementById('ov-close').addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });

  document.getElementById('p-home').classList.add('visible');
  document.querySelectorAll('[data-panel="home"]').forEach(function(el) { el.classList.add('active'); });
  runCounters();

  var slides = document.querySelectorAll('.hs-slide'), idx = 0;
  setInterval(function() {
    slides[idx].classList.remove('hs-active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('hs-active');
  }, 5000);

  var obs = {};
  function observeCards(sel) {
    if (obs[sel]) obs[sel].disconnect();
    document.querySelectorAll(sel).forEach(function(c) { c.classList.remove('in-view'); });
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { e.target.classList.toggle('in-view', e.isIntersecting); });
    }, { threshold: 0.08 });
    document.querySelectorAll(sel).forEach(function(c) { io.observe(c); });
    obs[sel] = io;
  }

  function observeAnims() {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('sp-in'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.sp-anim').forEach(function(el) { el.classList.remove('sp-in'); io.observe(el); });
  }
  observeAnims();

  /* ── Scroll-pinned beam slam ──
     Wheel events on the hero are captured and used to drive the beam position.
     The page does NOT scroll until the beam is fully locked in. */
  (function(){
    var mid = document.querySelector('.sl-mid');
    var h1  = document.querySelector('.hs-h1');
    var hero = document.querySelector('.hero-wrap');
    if (!mid || !h1 || !hero) return;

    /* Touch / no-wheel devices never fire the wheel-driven reveal — show the middle line statically and skip the beam intercept */
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches || !('onwheel' in window)) {
      mid.style.opacity = '1';
      mid.style.transform = 'none';
      return;
    }

    var MAX_OFFSET = Math.min(window.innerWidth * 0.5, 700); /* start distance */
    var SCROLL_BUDGET = 350; /* total wheel delta needed to fully snap */
    var accumulated = 0;     /* how much the user has scrolled */
    var phase = 'waiting';   /* waiting | sliding | done */

    function setBeamPos(progress) {
      /* progress: 0 = fully off-screen right, 1 = locked in place */
      var ease = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      var x = MAX_OFFSET * (1 - ease);
      mid.style.transform = 'translate3d(' + x + 'px,0,0)'; /* GPU accelerated */
      mid.style.opacity = Math.min(progress * 2.5, 1);
    }

    function triggerImpact() {
      /* Micro-shake on h1 */
      h1.classList.add('impact');
      setTimeout(function(){ h1.classList.remove('impact'); }, 180);
      /* Shine sweep on letterforms only */
      setTimeout(function(){
        h1.querySelectorAll('.sl').forEach(function(s){ s.classList.add('shining'); });
        /* Clean up after shine so text doesn't disappear */
        setTimeout(function(){
          h1.querySelectorAll('.sl').forEach(function(s){
            s.classList.remove('shining');
            s.style.background = '';
            s.style.webkitBackgroundClip = '';
            s.style.backgroundClip = '';
            s.style.webkitTextFillColor = '';
          });
          h1.querySelectorAll('.sl .ac').forEach(function(a){
            a.style.background = '';
            a.style.webkitBackgroundClip = '';
            a.style.backgroundClip = '';
            a.style.webkitTextFillColor = '';
          });
        }, 1300);
      }, 250);
    }

    function resetBeam() {
      accumulated = 0;
      phase = 'waiting';
      mid.style.transform = 'translateX(' + MAX_OFFSET + 'px)';
      mid.style.opacity = '0';
      h1.classList.remove('impact');
      h1.querySelectorAll('.sl').forEach(function(s){
        s.classList.remove('shining');
        s.style.background = '';
        s.style.webkitBackgroundClip = '';
        s.style.backgroundClip = '';
        s.style.webkitTextFillColor = '';
      });
    }

    /* Initialize: beam starts off-screen */
    setBeamPos(0);

    /* Wheel handler — captures scroll on hero, drives beam position */
    var beamRafPending = false;
    window.addEventListener('wheel', function(e) {
      if (phase === 'done') return;  /* normal scrolling */
      var homePanel = document.getElementById('p-home');
      if (!homePanel.classList.contains('visible')) return;
      if (window.scrollY > 50) return;
      if (e.deltaY <= 0) return;

      e.preventDefault();
      phase = 'sliding';
      accumulated = Math.min(accumulated + e.deltaY, SCROLL_BUDGET);

      if (!beamRafPending) {
        beamRafPending = true;
        requestAnimationFrame(function() {
          beamRafPending = false;
          var progress = accumulated / SCROLL_BUDGET;
          setBeamPos(progress);
          if (progress >= 1) {
            phase = 'done';
            mid.style.transform = 'translateX(0)';
            mid.style.opacity = '1';
            triggerImpact();
          }
        });
      }
    }, {passive: false});

    /* Replay on panel switch back to home */
    document.querySelectorAll('[data-panel="home"]').forEach(function(btn){
      btn.addEventListener('click', function(){
        resetBeam();
      });
    });

    /* Recalculate max offset on resize */
    window.addEventListener('resize', function(){
      MAX_OFFSET = Math.min(window.innerWidth * 0.5, 700);
      if (phase === 'waiting') setBeamPos(0);
    });
  })();

  /* Counters — only animate when stat-bar scrolls into view */
  var countersFired = false;
  function runCounters() {
    if (countersFired) return;
    var bar = document.querySelector('.stat-bar');
    if (!bar) return;
    var cIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting && !countersFired) {
          countersFired = true;
          cIO.disconnect();
          document.querySelectorAll('.stat-n[data-to]').forEach(function(el, i) {
            setTimeout(function(){
              var target = +el.dataset.to, suffix = el.dataset.suffix || '', dur = 1400, t0 = performance.now();
              function tick(now) {
                var pg = Math.min((now - t0) / dur, 1);
                var ease = 1 - Math.pow(1 - pg, 3);
                el.textContent = Math.round(ease * target) + suffix;
                if (pg < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
            }, i * 150); /* stagger each counter */
          });
        }
      });
    }, {threshold: 0.5});
    cIO.observe(bar);
  }

  /* ── Scroll-driven canvas frame sequence with lerp smoothing ── */
  (function(){
    var TOTAL_FRAMES = 196;
    var LERP_SPEED = 0.08; /* lower = smoother/slower easing (0.05-0.15 range) */
    var wrap = document.getElementById('vidScrollWrap');
    var canvas = document.getElementById('vidCanvas');
    var bar = document.getElementById('vidBar');
    if (!wrap || !canvas) return;
    var ctx = canvas.getContext('2d');

    /* Mobile: skip the 196-frame preload (heavy on data + memory). Show one static frame and collapse the tall scroll container. */
    if (window.matchMedia('(max-width: 700px), (pointer: coarse)').matches) {
      wrap.classList.add('vid-done','vid-playing');
      var still = new Image();
      still.onload = function(){ canvas.width = still.naturalWidth; canvas.height = still.naturalHeight; ctx.drawImage(still, 0, 0); };
      still.src = 'vid-frames/f195.jpg';
      if (bar) bar.style.width = '100%';
      return;
    }

    /* Preload all frames */
    var frames = [];
    var loaded = 0;
    var currentFrame = -1;
    var targetFrame = 0;   /* where scroll says we should be */
    var smoothFrame = 0;   /* where we actually are (lerped) */
    var animating = false;

    for (var i = 0; i < TOTAL_FRAMES; i++) {
      (function(idx){
        var img = new Image();
        img.src = 'vid-frames/f' + String(idx).padStart(3,'0') + '.jpg';
        img.onload = function(){
          loaded++;
          if (idx === 0) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
          }
        };
        frames[idx] = img;
      })(i);
    }

    /* Render loop — runs continuously, lerps toward target frame */
    function renderLoop() {
      /* Lerp: smoothly ease current frame toward target */
      smoothFrame += (targetFrame - smoothFrame) * LERP_SPEED;

      var frameIdx = Math.round(smoothFrame);
      frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIdx));

      if (frameIdx !== currentFrame && frames[frameIdx] && frames[frameIdx].complete) {
        ctx.drawImage(frames[frameIdx], 0, 0);
        currentFrame = frameIdx;
      }

      /* Keep animating if we haven't settled */
      if (Math.abs(targetFrame - smoothFrame) > 0.5) {
        requestAnimationFrame(renderLoop);
      } else {
        animating = false;
      }
    }

    function startAnimating() {
      if (!animating) {
        animating = true;
        requestAnimationFrame(renderLoop);
      }
    }

    /* Once video completes, collapse so scrolling back up is instant */
    var completed = false;

    /* Scroll handler — just updates the target, render loop does the rest */
    window.addEventListener('scroll', function(){
      if (completed) return; /* skip all processing after collapse */
      var rect = wrap.getBoundingClientRect();
      var wrapH = wrap.offsetHeight;
      var viewH = window.innerHeight;
      var scrolled = -rect.top;
      var scrollRange = wrapH - viewH;
      if (scrollRange <= 0) return;
      var progress = Math.max(0, Math.min(1, scrolled / scrollRange));

      targetFrame = progress * (TOTAL_FRAMES - 1);

      /* Progress bar */
      if (bar) bar.style.width = (progress * 100) + '%';

      /* Title reveal after 10% */
      if (progress > 0.1) {
        wrap.classList.add('vid-playing');
      }

      startAnimating();

      /* When fully scrolled through, show last frame and collapse */
      if (progress >= 0.98 && !completed) {
        completed = true;
        /* Jump to last frame */
        smoothFrame = TOTAL_FRAMES - 1;
        targetFrame = TOTAL_FRAMES - 1;
        if (frames[TOTAL_FRAMES - 1] && frames[TOTAL_FRAMES - 1].complete) {
          ctx.drawImage(frames[TOTAL_FRAMES - 1], 0, 0);
          currentFrame = TOTAL_FRAMES - 1;
        }
        /* Collapse the scroll height so it's just a static 100vh image */
        setTimeout(function(){
          wrap.classList.add('vid-done');
          if (bar) bar.style.width = '100%';
        }, 300);
      }
    }, {passive: true});
  })();

    window.handleForm = function(e) {
    e.preventDefault();
    var form = e.target, btn = form.querySelector('.btn-submit'), orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    fetch('https://formsubmit.co/ajax/ubcosteelbridge@gmail.com', {
      method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
    }).then(function(r){ return r.json(); }).then(function(){
      btn.textContent = 'Sent ✓'; btn.style.background = '#1a6e3a';
      setTimeout(function(){ btn.textContent = orig; btn.style.cssText = ''; btn.disabled = false; form.reset(); }, 4000);
    }).catch(function(){
      btn.textContent = 'Could not send'; btn.style.background = '#8a2a2a';
      setTimeout(function(){ btn.textContent = orig; btn.style.cssText = ''; btn.disabled = false; }, 4000);
    });
  };
})();

/* duplicate counter removed — handled inside main IIFE */

// PARALLAX ON HERO (rAF throttled)
var heroSlides=document.querySelectorAll('.hs-slide');
var paraTicking=false;
window.addEventListener('scroll',function(){
  if(!paraTicking){
    requestAnimationFrame(function(){
      var st=window.pageYOffset;
      heroSlides.forEach(function(s){
        s.style.transform='translate3d(0,'+st*0.15+'px,0) scale(1.05)';
      });
      paraTicking=false;
    });
    paraTicking=true;
  }
},{passive:true});
/* ── Season Log gallery lightbox ── */
(function(){
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbImg = lb.querySelector('.lb-img');
  var lbCap = lb.querySelector('.lb-cap');
  var cells = [], curIdx = 0;
  function render(){
    var cell = cells[curIdx]; if (!cell) return;
    var img = cell.querySelector('img');
    lbImg.src = (img && (img.currentSrc || img.src)) || '';
    lbImg.alt = (img && img.alt) || '';
    var cap = cell.getAttribute('data-cap') || '';
    lbCap.textContent = cap;
    lbCap.style.display = cap ? '' : 'none';
  }
  function openFrom(cell){
    var grid = cell.closest('.ev-gallery-grid') || document;
    cells = Array.prototype.slice.call(grid.querySelectorAll('.gal-cell'));
    curIdx = cells.indexOf(cell);
    render();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  function move(d){
    if (!cells.length) return;
    curIdx = (curIdx + d + cells.length) % cells.length;
    render();
  }
  document.addEventListener('click', function(e){
    var cell = e.target.closest('.gal-cell');
    if (cell) { openFrom(cell); return; }
    if (e.target.closest('.lb-next')) { move(1); return; }
    if (e.target.closest('.lb-prev')) { move(-1); return; }
    if (e.target.closest('.lb-close') || e.target === lb) { close(); return; }
  });
  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
  });
})();