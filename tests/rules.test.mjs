// Every rule build.mjs enforces on tools.json. A broken rule stops the build with exit 1, names the
// problem after "tools.json: ", and leaves index.html as it was.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { data, project, tool, PAGE } from './helpers.mjs';

const chars = (n) => 'x'.repeat(n);

function refused(t, d, problem) {
  const p = project(t, { data: d });
  const r = p.run();
  assert.equal(r.code, 1, `expected exit 1, got ${r.code}: ${r.stdout}${r.stderr}`);
  assert.ok(r.stderr.includes(`tools.json: ${problem}`), `expected "tools.json: ${problem}" in:\n${r.stderr}`);
  assert.equal(p.page(), PAGE, 'index.html must be left as it was');
}

function allowed(t, d) {
  const p = project(t, { data: d });
  const r = p.run();
  assert.equal(r.code, 0, r.stderr);
  assert.doesNotMatch(r.stderr, /tools\.json:/);
}

test('a valid tools.json builds', (t) => allowed(t, data()));

test('a repo listed twice in tools is refused', (t) =>
  refused(t, data({ tools: [tool('alpha'), tool('alpha')] }), 'alpha is listed twice'));

test('a repo listed in tools and in around is refused', (t) =>
  refused(t, data({ around: [{ repo: 'alpha', description: 'Again' }] }), 'alpha is listed twice'));

test('a repo listed twice in around is refused', (t) =>
  refused(t, data({ around: [{ repo: 'brand', description: 'The brand' }, { repo: 'brand', description: 'The brand' }] }), 'brand is listed twice'));

test('a tool with no description is refused', (t) =>
  refused(t, data({ tools: [tool('alpha', { description: '' })] }), 'alpha has no description'));

test('a repo around them with no description is refused', (t) =>
  refused(t, data({ around: [{ repo: 'brand' }] }), 'brand has no description'));

test('a description that ends with a period is refused', (t) =>
  refused(t, data({ tools: [tool('alpha', { description: 'Does a thing.' })] }), 'alpha: description ends with a period'));

test('a description that ends with a period and a space is refused', (t) =>
  refused(t, data({ tools: [tool('alpha', { description: 'Does a thing. ' })] }), 'alpha: description ends with a period'));

test('a period inside a description is fine', (t) =>
  allowed(t, data({ tools: [tool('alpha', { description: 'Works with v1.2 files' })] })));

test('a repo around them whose description ends with a period is refused', (t) =>
  refused(t, data({ around: [{ repo: 'brand', description: 'The brand.' }] }), 'brand: description ends with a period'));

test('a description of 64 characters is allowed', (t) =>
  allowed(t, data({ tools: [tool('alpha', { description: chars(64) })] })));

test('a description of 65 characters is refused', (t) =>
  refused(t, data({ tools: [tool('alpha', { description: chars(65) })] }), 'alpha: description is 65 chars (keep it near 60)'));

test('a repo around them with a description of 65 characters is refused', (t) =>
  refused(t, data({ around: [{ repo: 'brand', description: chars(65) }] }), 'brand: description is 65 chars (keep it near 60)'));

for (const k of ['in', 'out', 'language']) {
  test(`a tool with no "${k}" is refused`, (t) => {
    const bare = tool('alpha');
    delete bare[k];
    refused(t, data({ tools: [bare] }), `alpha has no "${k}"`);
  });
}

test('a repo around them needs no in, out or language', (t) =>
  allowed(t, data({ around: [{ repo: 'brand', description: 'The brand' }] })));

for (const k of ['in', 'out']) {
  test(`an "${k}" of 40 characters is allowed`, (t) =>
    allowed(t, data({ tools: [tool('alpha', { [k]: chars(40) })] })));

  test(`an "${k}" of 41 characters is refused`, (t) =>
    refused(t, data({ tools: [tool('alpha', { [k]: chars(41) })] }), `alpha: "${k}" is 41 chars, the limit is 40`));

  test(`backticks in "${k}" don't count toward the 40`, (t) =>
    allowed(t, data({ tools: [tool('alpha', { [k]: `\`${chars(20)}\` \`${chars(17)}\`` })] })));

  test(`an "${k}" of 41 characters inside backticks is refused`, (t) =>
    refused(t, data({ tools: [tool('alpha', { [k]: `\`${chars(41)}\`` })] }), `alpha: "${k}" is 41 chars, the limit is 40`));
}

test('every problem is listed, not only the first', (t) => {
  const p = project(t, { data: data({ tools: [tool('alpha', { description: 'Ends.' }), tool('alpha', { out: '' })] }) });
  const r = p.run();
  assert.equal(r.code, 1);
  const lines = r.stderr.trim().split(/\r?\n/);
  assert.deepEqual(lines, ['tools.json: alpha: description ends with a period', 'tools.json: alpha is listed twice', 'tools.json: alpha has no "out"']);
});

test('--check refuses a broken tools.json too', (t) => {
  const p = project(t, { data: data({ tools: [tool('alpha', { language: '' })] }) });
  const r = p.run(['--check']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /tools\.json: alpha has no "language"/);
});
