// real-fruit-snacks.github.io: the theme switch, and the board running each tool's job in turn.
// Without JS the display shows the first tool's finished job and every row shows its own.
// With reduced motion nothing cycles or sweeps; hover and focus still switch the display.
(function () {
  var root = document.documentElement;
  var still = matchMedia('(prefers-reduced-motion: reduce)');
  var light = matchMedia('(prefers-color-scheme: light)');
  var $ = function (id) { return document.getElementById(id); };

  // ---- theme ----
  function theme() { return root.dataset.theme || (light.matches ? 'dayshift' : 'nightshift'); }
  function paint() {
    var night = theme() === 'nightshift';
    document.querySelector('meta[name="theme-color"]').content = night ? '#0C0D10' : '#F6F5F2';
    $('theme').setAttribute('aria-label', 'Theme: ' + (night ? 'night' : 'day') + '. Switch to ' + (night ? 'day' : 'night'));
  }
  $('theme').addEventListener('click', function (e) {
    var flip = function () {
      root.dataset.theme = theme() === 'nightshift' ? 'dayshift' : 'nightshift';
      try { localStorage.setItem('rfs-theme', root.dataset.theme); } catch (err) {}
      paint();
    };
    if (!document.startViewTransition || still.matches) return flip();
    var x = e.clientX || innerWidth - 40, y = e.clientY || 34;
    var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(flip).ready.then(function () {
      root.animate({ clipPath: ['circle(0 at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' });
    });
  });
  light.addEventListener('change', paint);
  paint();

  // ---- the board ----
  var tools = [].slice.call(document.querySelectorAll('.tool'));
  var display = $('display'), marker = document.querySelector('.marker'), at = $('at'), pause = $('pause');
  if (!tools.length || !display) return;
  var q = function (el, sel) { return el.querySelector(sel); };
  var job = q(display, '.d-job');
  var current = -1, timer = 0, playing = !still.matches, onScreen = true, EVERY = 4500;

  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  // Log lines and file names only break at spaces, so a long one shrinks the job until it fits.
  function fit() {
    job.style.fontSize = '';
    var k = 1;
    job.querySelectorAll('.v').forEach(function (v) { if (v.scrollWidth > v.clientWidth + 1) k = Math.min(k, v.clientWidth / v.scrollWidth); });
    if (k < 1) job.style.fontSize = (parseFloat(getComputedStyle(job).fontSize) * k * 0.97).toFixed(1) + 'px';
  }
  function place() {
    var t = tools[current];
    if (!t || !marker) return;
    marker.style.setProperty('--y', t.offsetTop + 'px');
    marker.style.setProperty('--h', t.offsetHeight + 'px');
  }

  function show(i) {
    if (i === current) return;
    var t = tools[i], prev = tools[current];
    if (prev) prev.classList.remove('on');
    t.classList.add('on');
    current = i;
    var n = String(i + 1).padStart(2, '0');
    q(display, '.d-no').textContent = n;
    q(display, '.d-name').textContent = t.dataset.repo;
    q(display, '.d-meta').textContent = q(t, '.meta .m').textContent;
    q(display, '.d-desc').textContent = q(t, '.desc').textContent;
    var vin = q(t, '.v-in').innerHTML;
    q(display, '.v-in .dim').innerHTML = vin;
    q(display, '.v-in .lit').innerHTML = vin;
    q(display, '.v-out').innerHTML = q(t, '.v-out').innerHTML;
    var links = display.querySelectorAll('.d-links a');
    links[0].href = t.dataset.site;
    links[0].textContent = t.dataset.site === t.dataset.src ? 'On GitHub' : 'Project page';
    links[1].href = t.dataset.src;
    at.textContent = n;
    fit(); place();
    if (!still.matches) { restart(display, 'swap'); restart(job, 'run'); }
    job.style.animationDelay = '';
  }

  function tick() {
    clearTimeout(timer);
    if (!playing || !onScreen || document.hidden) return;
    timer = setTimeout(function () { show((current + 1) % tools.length); tick(); }, EVERY);
  }
  function setPlaying(on) {
    playing = on;
    pause.textContent = on ? 'Pause' : 'Play';
    pause.setAttribute('aria-pressed', String(!on));
    tick();
  }

  // Pointing at or focusing a tool shows its job and stops the cycle.
  tools.forEach(function (t, i) {
    var take = function () { if (playing) setPlaying(false); show(i); };
    q(t, '.row').addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') take(); });
    q(t, '.row').addEventListener('focus', take);
  });
  pause.addEventListener('click', function () { setPlaying(!playing); if (playing) { show((current + 1) % tools.length); } });
  if (still.matches) setPlaying(false);
  // Turning reduced motion on while the page is open stops the cycle, as loading with it on does;
  // turning it off again brings the cycle back, unless the visitor paused or picked a tool meanwhile.
  // A page loaded with it on is paused by it too, so it starts cycling once it's turned off.
  var motionPaused = still.matches;
  pause.addEventListener('click', function () { motionPaused = false; });
  tools.forEach(function (t) {
    q(t, '.row').addEventListener('focus', function () { motionPaused = false; });
    q(t, '.row').addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') motionPaused = false; });
  });
  still.addEventListener('change', function () {
    if (still.matches && playing) { motionPaused = true; setPlaying(false); }
    else if (!still.matches && motionPaused) { motionPaused = false; setPlaying(true); }
  });

  new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; tick(); }).observe(display);
  document.addEventListener('visibilitychange', tick);
  addEventListener('resize', function () {
    if (marker) { marker.classList.add('still'); requestAnimationFrame(function () { requestAnimationFrame(function () { marker.classList.remove('still'); }); }); }
    fit(); place();
  });
  if (document.fonts) document.fonts.ready.then(function () { fit(); place(); });

  // First run: the display already holds tool 01's input; the seam runs it.
  current = -1; show(0); if (!still.matches) job.style.animationDelay = '900ms'; tick();
})();
