// --github, against the stand-in gh in tests/stand-in (never the real one): every listed repo must exist
// under its own name, be public and not archived; every retired one must be archived.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { data, project } from './helpers.mjs';

const OWNER = 'Real-Fruit-Snacks';
const repo = (name, extra = {}) => ({ name, archived: false, private: false, description: `What ${name} does`, ...extra });
// What GitHub says about the repos in data(): all as they should be.
const github = (change = {}) => {
  const all = {
    alpha: repo('alpha'), beta: repo('beta'), brand: repo('brand', { description: 'The brand' }), Old: repo('Old', { archived: true }),
    ...change,
  };
  return Object.fromEntries(Object.entries(all).filter(([, v]) => v).map(([k, v]) => [`${OWNER}/${k}`, v]));
};

function check(t, gh, d = data()) {
  const p = project(t, { data: d });
  p.run();
  return p.run(['--check', '--github'], { gh });
}

function fails(t, gh, problem) {
  const r = check(t, gh);
  assert.equal(r.code, 1, `expected exit 1, got ${r.code}: ${r.stdout}${r.stderr}`);
  assert.ok(r.stderr.split(/\r?\n/).includes(problem), `expected "${problem}" in:\n${r.stderr}`);
  assert.doesNotMatch(r.stdout, /every listed repo is public/);
}

test('--github passes when every repo is as tools.json says', (t) => {
  const r = check(t, github());
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /every listed repo is public; tools are active, retired ones are archived/);
});

test('--github asks gh about every listed and retired repo, by its full name', (t) => {
  const r = check(t, github());
  assert.deepEqual(r.calls.map((c) => c.slice(0, 2)), [
    ['api', `repos/${OWNER}/alpha`], ['api', `repos/${OWNER}/beta`], ['api', `repos/${OWNER}/brand`], ['api', `repos/${OWNER}/Old`],
  ]);
  for (const c of r.calls) assert.deepEqual(c.slice(2), ['--jq', '{a: .archived, p: .private, d: .description, n: .name}']);
});

test('without --github, gh is never asked', (t) => {
  const p = project(t);
  p.run();
  const r = p.run(['--check'], { gh: github() });
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(r.calls, []);
});

test('--github fails on a tool GitHub has renamed', (t) =>
  fails(t, github({ alpha: repo('Alpha-2') }), 'alpha: GitHub calls it Alpha-2'));

test('--github fails on a private tool', (t) =>
  fails(t, github({ beta: repo('beta', { private: true }) }), 'beta: is private'));

test('--github fails on an archived tool', (t) =>
  fails(t, github({ alpha: repo('alpha', { archived: true }) }), 'alpha: is archived; move it to "retired"'));

test('--github fails on a tool gh cannot find', (t) =>
  fails(t, github({ beta: null }), 'beta: not found on GitHub'));

test('--github checks the repos around the tools too', (t) =>
  fails(t, github({ brand: repo('brand', { archived: true, description: 'The brand' }) }), 'brand: is archived; move it to "retired"'));

test('--github fails on a repo around the tools that gh cannot find', (t) =>
  fails(t, github({ brand: null }), 'brand: not found on GitHub'));

test('--github fails on a retired repo that is not archived', (t) =>
  fails(t, github({ Old: repo('Old') }), 'Old: listed as retired, but not archived'));

test('--github fails on a retired repo gh cannot find', (t) =>
  fails(t, github({ Old: null }), 'Old: retired, but not found on GitHub'));

test('--github lists every failure, not only the first', (t) => {
  const r = check(t, github({ alpha: repo('alpha', { private: true }), Old: repo('Old') }));
  assert.equal(r.code, 1);
  assert.deepEqual(r.stderr.trim().split(/\r?\n/), ['alpha: is private', 'Old: listed as retired, but not archived']);
});

test('--github only notes a description that differs from GitHub\'s', (t) => {
  const r = check(t, github({ beta: repo('beta', { description: 'Something else' }) }));
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /note: beta: GitHub's description differs: "Something else"/);
});
