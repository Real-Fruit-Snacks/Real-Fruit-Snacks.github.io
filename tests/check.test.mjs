// --check: exit 0 on a page that matches tools.json, exit 1 on one that doesn't, and never write the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { data, project, tool, ROOT } from './helpers.mjs';

test('--check passes on a page that is current', (t) => {
  const p = project(t);
  p.run();
  const current = p.page();
  const r = p.run(['--check']);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), 'index.html matches tools.json (2 tools, 1 around them, 1 retired)');
  assert.equal(p.page(), current);
});

test('--check passes on the real page', (t) => {
  const p = project(t, { real: true });
  const r = p.run(['--check']);
  assert.equal(r.code, 0, r.stderr);
  // The counts come from the real tools.json, so this follows the list as tools are added and retired.
  const real = JSON.parse(readFileSync(join(ROOT, 'tools.json'), 'utf8'));
  assert.equal(r.stdout.trim(), `index.html matches tools.json (${real.tools.length} tools, ${real.around.length} around them, ${real.retired.length} retired)`);
});

test('--check fails on a page that was never built, and leaves it as it was', (t) => {
  const p = project(t);
  const stale = p.page();
  const r = p.run(['--check']);
  assert.equal(r.code, 1);
  assert.equal(r.stderr.trim(), 'index.html is out of date with tools.json: run node scripts/build.mjs');
  assert.equal(r.stdout, '');
  assert.equal(p.page(), stale);
});

test('--check fails when tools.json changed after the build, and leaves the page as it was', (t) => {
  const p = project(t);
  p.run();
  p.data(data({ tools: [tool('alpha'), tool('beta', { description: 'Something new' })] }));
  const stale = p.page();
  const r = p.run(['--check']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /index\.html is out of date with tools\.json/);
  assert.equal(p.page(), stale);
});

test('--check fails when the page was edited between the markers, and leaves the edit', (t) => {
  const p = project(t);
  p.run();
  const edited = p.page().replace('<!-- build:count -->2', '<!-- build:count -->9');
  writeFileSync(join(p.dir, 'index.html'), edited);
  const r = p.run(['--check']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /index.html is out of date with tools.json/);
  assert.equal(p.page(), edited);
});
