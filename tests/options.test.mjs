// Options: only --check and --github are known. Anything else is refused before index.html is read or
// written, so a mistyped --check in CI fails instead of quietly passing; --help prints the usage.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project, PAGE } from './helpers.mjs';

for (const opt of ['--chek', '--Check', '-c', 'check']) {
  test(`an unknown option (${opt}) is refused with exit 2, and the page is left as it was`, (t) => {
    const p = project(t);
    const r = p.run([opt]);
    assert.equal(r.code, 2, `expected exit 2, got ${r.code}: ${r.stdout}${r.stderr}`);
    assert.match(r.stderr, new RegExp(`^unknown option: ${opt}\\n`));
    assert.match(r.stderr, /usage: node scripts\/build\.mjs/);
    assert.equal(r.stdout, '');
    assert.equal(p.page(), PAGE);
  });
}

test('an unknown option next to --check is refused too', (t) => {
  const p = project(t);
  p.run();
  const r = p.run(['--check', '--githbu']);
  assert.equal(r.code, 2);
  assert.match(r.stderr, /^unknown option: --githbu\n/);
});

for (const opt of ['--help', '-h']) {
  test(`${opt} prints the usage, exits 0 and leaves the page as it was`, (t) => {
    const p = project(t);
    const r = p.run([opt]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /^usage: node scripts\/build\.mjs \[--check\] \[--github\]/);
    assert.equal(p.page(), PAGE);
  });
}
