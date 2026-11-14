// A stand-in for the browser, just enough for script.js to run in node:vm: the elements it looks up, a
// prefers-reduced-motion query the test can flip, and timers the test moves on by hand. No real DOM; the
// tests look at what a visitor would see: the Pause/Play button and the tool number the display shows.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { ROOT } from './helpers.mjs';

function element(name = '') {
  const listeners = {};
  const one = {};
  const all = {};
  const el = {
    name, dataset: {}, style: { setProperty() {} }, attributes: {}, textContent: '', innerHTML: '', href: '',
    offsetTop: 0, offsetHeight: 0, offsetWidth: 0, scrollWidth: 0, clientWidth: 0,
    classList: { set: new Set(), add(c) { this.set.add(c); }, remove(c) { this.set.delete(c); }, contains(c) { return this.set.has(c); } },
    setAttribute(k, v) { el.attributes[k] = v; },
    addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
    fire(type, e = {}) { for (const fn of listeners[type] || []) fn(e); },
    querySelector(sel) { return (one[sel] ||= element(`${name} ${sel}`)); },
    querySelectorAll(sel) { return all[sel] || []; },
    setAll(sel, list) { all[sel] = list; },
    animate() {},
  };
  return el;
}

function mediaQuery(matches) {
  const listeners = [];
  return {
    matches,
    addEventListener(type, fn) { if (type === 'change') listeners.push(fn); },
    set(on) { this.matches = on; for (const fn of listeners) fn({ matches: on }); },
  };
}

// Load script.js on a page with `tools` rows. Returns what a test needs to drive it and look at it.
export function page({ reducedMotion = false, tools = 3 } = {}) {
  const still = mediaQuery(reducedMotion);
  const light = mediaQuery(false);
  const byId = { theme: element('#theme'), display: element('#display'), at: element('#at'), pause: element('#pause') };
  byId.pause.textContent = 'Pause';
  byId.display.setAll('.d-links a', [element('a'), element('a')]);
  const rows = Array.from({ length: tools }, (_, i) => {
    const t = element(`tool ${i + 1}`);
    Object.assign(t.dataset, { repo: `tool-${i + 1}`, site: `https://example.org/${i + 1}/`, src: `https://example.org/${i + 1}/` });
    return t;
  });
  const meta = element('meta');
  const docListeners = {};
  const document = {
    documentElement: element('html'), hidden: false,
    getElementById: (id) => byId[id] || null,
    querySelector: (sel) => (sel === '.marker' ? null : sel.startsWith('meta') ? meta : null),
    querySelectorAll: (sel) => (sel === '.tool' ? rows : []),
    addEventListener(type, fn) { (docListeners[type] ||= []).push(fn); },
  };

  let now = 0;
  let timers = [];
  let nextId = 1;
  const sandbox = {
    document,
    matchMedia: (q) => (q.includes('reduced-motion') ? still : light),
    IntersectionObserver: class { observe() {} },
    localStorage: { getItem() { return null; }, setItem() {} },
    getComputedStyle: () => ({ fontSize: '16px' }),
    requestAnimationFrame: (fn) => fn(),
    addEventListener() {},
    innerWidth: 1280, innerHeight: 800,
    setTimeout(fn, ms) { const id = nextId++; timers.push({ id, at: now + ms, fn }); return id; },
    clearTimeout(id) { timers = timers.filter((t) => t.id !== id); },
  };
  vm.runInNewContext(readFileSync(join(ROOT, 'script.js'), 'utf8'), sandbox, { filename: 'script.js' });

  return {
    // The visitor turns reduced motion on or off in their system settings.
    reducedMotion: (on) => still.set(on),
    // The Pause/Play button's label: "Pause" while the board cycles.
    button: () => byId.pause.textContent,
    press: () => byId.pause.fire('click'),
    focus: (i) => rows[i].querySelector('.row').fire('focus'),
    // The number of the tool on the display, "01" for the first.
    showing: () => byId.at.textContent,
    // Move the clock on by ms, running every timer that comes due.
    wait(ms) {
      const end = now + ms;
      for (;;) {
        const due = timers.filter((t) => t.at <= end).sort((a, b) => a.at - b.at)[0];
        if (!due) break;
        timers = timers.filter((t) => t !== due);
        now = due.at;
        due.fn();
      }
      now = end;
    },
  };
}
