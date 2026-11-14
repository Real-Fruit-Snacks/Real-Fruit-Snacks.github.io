// What build.mjs writes between the <!-- build:NAME --> and <!-- /build:NAME --> markers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { data, project, tool, PAGE } from './helpers.mjs';

const NAMES = ['count', 'board', 'display', 'around', 'retired'];
// The text between a block's markers, for every copy of that block in the page.
const blocks = (page, name) => [...page.matchAll(new RegExp(`<!-- build:${name} -->([\\s\\S]*?)<!-- /build:${name} -->`, 'g'))].map((m) => m[1]);

test('a build writes the page and says so', (t) => {
  const p = project(t);
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), 'wrote index.html (2 tools, 1 around them, 1 retired)');
  assert.notEqual(p.page(), PAGE);
});

test('every marker is still in the page after a build', (t) => {
  const p = project(t);
  p.run();
  for (const name of NAMES) {
    assert.ok(p.page().includes(`<!-- build:${name} -->`), `<!-- build:${name} --> is gone`);
    assert.ok(p.page().includes(`<!-- /build:${name} -->`), `<!-- /build:${name} --> is gone`);
  }
});

test('only what is between the markers changes', (t) => {
  const p = project(t);
  p.run();
  const outside = (s) => s.replace(/(<!-- build:(\w+) -->)[\s\S]*?(<!-- \/build:\2 -->)/g, '$1$3');
  assert.equal(outside(p.page()), outside(PAGE));
});

test('a second build changes nothing', (t) => {
  const p = project(t);
  p.run();
  const once = p.page();
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), 'index.html already matches tools.json');
  assert.equal(p.page(), once);
});

test('the count is the number of tools, written inline in every copy', (t) => {
  const p = project(t);
  p.run();
  assert.deepEqual(blocks(p.page(), 'count'), ['2', '2']);
});

test('the count follows tools.json', (t) => {
  const p = project(t);
  p.run();
  p.data(data({ tools: [tool('alpha'), tool('beta'), tool('gamma')] }));
  p.run();
  assert.deepEqual(blocks(p.page(), 'count'), ['3', '3']);
});

test('retired is written inline: one link per archived repo', (t) => {
  const p = project(t, { data: data({ retired: ['Old', 'Older'] }) });
  p.run();
  assert.deepEqual(blocks(p.page(), 'retired'), [
    '<li><a href="https://github.com/Real-Fruit-Snacks/Old">Old</a></li><li><a href="https://github.com/Real-Fruit-Snacks/Older">Older</a></li>',
  ]);
});

for (const name of ['board', 'display', 'around']) {
  test(`${name} is written on lines of its own between its markers`, (t) => {
    const p = project(t);
    p.run();
    const [inner] = blocks(p.page(), name);
    assert.ok(inner.startsWith('\n<') && inner.endsWith('>\n'), `${name} block: ${JSON.stringify(inner.slice(0, 60))}`);
  });
}

test('board has one row per tool, in order, numbered, linking to its site or its repo', (t) => {
  const p = project(t);
  p.run();
  const [board] = blocks(p.page(), 'board');
  const rows = [...board.matchAll(/<li class="tool" data-repo="([^"]+)" data-site="([^"]+)" data-src="([^"]+)">/g)].map((m) => m.slice(1));
  assert.deepEqual(rows, [
    ['alpha', 'https://example.org/alpha/', 'https://github.com/Real-Fruit-Snacks/alpha'],
    ['beta', 'https://github.com/Real-Fruit-Snacks/beta', 'https://github.com/Real-Fruit-Snacks/beta'],
  ]);
  assert.match(board, /<span class="no">01<\/span><span class="name">alpha<\/span>/);
  assert.match(board, /<span class="no">02<\/span><span class="name">beta<\/span>/);
  assert.match(board, /<span class="m">Rust · Windows<\/span>/);
});

test('display shows the first tool', (t) => {
  const p = project(t);
  p.run();
  const [display] = blocks(p.page(), 'display');
  assert.match(display, /^\n<div class="d-head"><span class="d-no">01<\/span><p class="d-name">alpha<\/p>/);
  assert.match(display, /<a tabindex="-1" href="https:\/\/example.org\/alpha\/">Project page<\/a>/);
});

test('around has one item per repo around the tools', (t) => {
  const p = project(t);
  p.run();
  const [around] = blocks(p.page(), 'around');
  assert.equal(around, '\n<li><a href="https://github.com/Real-Fruit-Snacks/brand">brand</a><span>The brand</span><a class="src" href="https://github.com/Real-Fruit-Snacks/brand">Source</a></li>\n');
});

test('text is escaped, and `backticks` become code', (t) => {
  const p = project(t, { data: data({ tools: [tool('alpha', { description: 'Reads <b> & "q"', in: '`a.txt` in' })] }) });
  p.run();
  const [board] = blocks(p.page(), 'board');
  assert.ok(board.includes('<p class="desc">Reads &lt;b&gt; &amp; &quot;q&quot;</p>'), board);
  assert.ok(!board.includes('<b>'));
  assert.ok(board.includes('<code><span class="w">a.txt</span></code> in'), board);
});

for (const name of NAMES) {
  test(`a page with no ${name} block is refused`, (t) => {
    const page = PAGE.replace(new RegExp(`<!-- build:${name} -->[\\s\\S]*?<!-- /build:${name} -->`, 'g'), '');
    const p = project(t, { page });
    const r = p.run();
    assert.equal(r.code, 1);
    assert.equal(r.stderr.trim(), `index.html has no <!-- build:${name} --> block`);
    assert.equal(p.page(), page, 'index.html must be left as it was');
  });
}

test('the real tools.json and index.html are already in step', (t) => {
  const p = project(t, { real: true });
  const before = p.page();
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), 'index.html already matches tools.json');
  assert.equal(p.page(), before);
});
