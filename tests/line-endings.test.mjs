// Line endings: a Windows checkout with git's core.autocrlf=true has index.html with CRLF, while the
// blocks build.mjs writes are joined with LF. Line endings alone must never make the page out of date.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { data, project, tool } from './helpers.mjs';

const crlf = (s) => s.replace(/\r?\n/g, '\r\n');
const write = (p, s) => writeFileSync(join(p.dir, 'index.html'), s);

test('--check passes on a current page checked out with CRLF', (t) => {
  const p = project(t);
  p.run();
  const page = crlf(p.page());
  write(p, page);
  const r = p.run(['--check']);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /^index\.html matches tools\.json/);
  assert.equal(p.page(), page);
});

test('--check still fails on a stale page checked out with CRLF', (t) => {
  const p = project(t);
  p.run();
  write(p, crlf(p.page()));
  p.data(data({ tools: [tool('alpha'), tool('beta', { description: 'Something new' })] }));
  const r = p.run(['--check']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /index\.html is out of date with tools\.json/);
});

test('a build leaves a current CRLF page as it was', (t) => {
  const p = project(t);
  p.run();
  const page = crlf(p.page());
  write(p, page);
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), 'index.html already matches tools.json');
  assert.equal(p.page(), page);
});

test('a build of a stale CRLF page writes it back with CRLF on every line', (t) => {
  const p = project(t);
  p.run();
  write(p, crlf(p.page()));
  p.data(data({ tools: [tool('alpha'), tool('beta', { description: 'Something new' })] }));
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /^wrote index\.html/);
  const page = p.page();
  assert.ok(page.includes('Something new'));
  assert.doesNotMatch(page, /[^\r]\n/, 'every line ends with CRLF');
});

// One stray CRLF line in an LF page.
const stray = (page) => page.replace('\n', '\r\n');

test('a build leaves a current LF page with one stray CRLF line as it was', (t) => {
  const p = project(t);
  p.run();
  const page = stray(p.page());
  write(p, page);
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), 'index.html already matches tools.json');
  assert.equal(p.page(), page);
});

test('a build of a stale LF page with one stray CRLF line keeps it LF', (t) => {
  const p = project(t);
  p.run();
  write(p, stray(p.page()));
  p.data(data({ tools: [tool('alpha'), tool('beta', { description: 'Something new' })] }));
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  const page = p.page();
  assert.ok(page.includes('Something new'));
  assert.ok(!page.includes('\r'), 'no CRLF left');
});
