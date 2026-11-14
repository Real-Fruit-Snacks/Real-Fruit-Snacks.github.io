// script.js and reduced motion: with it on, the board doesn't cycle; turning it on or off while the page
// is open does what loading with it set would, unless the visitor paused or picked a tool meanwhile.
// Runs script.js against the stand-in browser in fake-page.mjs, so no browser is needed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page } from './fake-page.mjs';

const EVERY = 4500; // the cycle's step in script.js

test('with motion allowed, the board cycles through the tools', () => {
  const p = page();
  assert.equal(p.showing(), '01');
  p.wait(EVERY);
  assert.equal(p.showing(), '02');
  assert.equal(p.button(), 'Pause');
});

test('loaded with reduced motion on, the board stays on the first tool', () => {
  const p = page({ reducedMotion: true });
  assert.equal(p.button(), 'Play');
  p.wait(EVERY * 3);
  assert.equal(p.showing(), '01');
});

test('turning reduced motion on mid-visit stops the cycle', () => {
  const p = page();
  p.wait(EVERY);
  p.reducedMotion(true);
  assert.equal(p.button(), 'Play');
  p.wait(EVERY * 3);
  assert.equal(p.showing(), '02');
});

test('turning reduced motion off again brings the cycle back', () => {
  const p = page();
  p.reducedMotion(true);
  p.wait(EVERY * 2);
  assert.equal(p.showing(), '01');
  p.reducedMotion(false);
  assert.equal(p.button(), 'Pause');
  p.wait(EVERY);
  assert.equal(p.showing(), '02');
});

test('a page loaded with reduced motion on starts cycling once it is turned off', () => {
  const p = page({ reducedMotion: true });
  p.reducedMotion(false);
  assert.equal(p.button(), 'Pause');
  p.wait(EVERY);
  assert.equal(p.showing(), '02');
});

test('a tool picked while motion was reduced stays shown after it is turned off', () => {
  const p = page();
  p.reducedMotion(true);
  p.focus(2);
  p.reducedMotion(false);
  assert.equal(p.button(), 'Play');
  p.wait(EVERY * 2);
  assert.equal(p.showing(), '03');
});

test('a visitor who pressed Play and then Pause stays paused after reduced motion is turned off', () => {
  const p = page({ reducedMotion: true });
  p.press();
  p.press();
  p.reducedMotion(false);
  assert.equal(p.button(), 'Play');
  const at = p.showing();
  p.wait(EVERY * 2);
  assert.equal(p.showing(), at);
});

test('a visitor who paused keeps the board paused when reduced motion is turned on and off', () => {
  const p = page();
  p.press();
  p.reducedMotion(true);
  p.reducedMotion(false);
  assert.equal(p.button(), 'Play');
  p.wait(EVERY * 2);
  assert.equal(p.showing(), '01');
});
