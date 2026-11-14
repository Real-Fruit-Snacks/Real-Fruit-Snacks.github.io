// Shared by the tests: a throwaway copy of the project for build.mjs to work on, and a way to run it.
// build.mjs reads tools.json and writes index.html next to its own folder, so each test copies the script
// into a temporary folder with its own tools.json and index.html, and the real ones are never touched.
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const USE_GH = join(ROOT, 'tests', 'stand-in', 'use-gh.cjs');

// A page with every build block, the count twice as on the real page.
export const PAGE = `<h2><!-- build:count -->0<!-- /build:count --> tools</h2>
<p><!-- build:count -->0<!-- /build:count --></p>
<ol>
<!-- build:board -->
<!-- /build:board -->
</ol>
<div>
<!-- build:display -->
<!-- /build:display -->
</div>
<ul>
<!-- build:around -->
<!-- /build:around -->
</ul>
<ul class="names"><!-- build:retired --><!-- /build:retired --></ul>
`;

export const tool = (repo, extra = {}) => ({ repo, description: `What ${repo} does`, language: 'Rust', in: '`input`', out: 'output', ...extra });

// A small, valid tools.json: two tools, one repo around them, one retired.
export const data = (change = {}) => ({
  tools: [tool('alpha', { platform: 'Windows', site: 'https://example.org/alpha/' }), tool('beta')],
  around: [{ repo: 'brand', description: 'The brand' }],
  retired: ['Old'],
  ...change,
});

// Make a project: { data, page } as objects/strings, or { real: true } for copies of the real tools.json
// and index.html. Returns { dir, page(), run(...args, { gh }) }.
export function project(t, { data: d = data(), page = PAGE, real = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'build-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'scripts'));
  copyFileSync(join(ROOT, 'scripts', 'build.mjs'), join(dir, 'scripts', 'build.mjs'));
  if (real) {
    // With LF endings, as they are committed and as CI checks them out: a Windows checkout with
    // core.autocrlf=true has CRLF, and build.mjs writes LF, so there the page would look out of date.
    const lf = (name) => writeFileSync(join(dir, name), readFileSync(join(ROOT, name), 'utf8').replaceAll('\r\n', '\n'));
    lf('tools.json');
    lf('index.html');
  } else {
    writeFileSync(join(dir, 'tools.json'), JSON.stringify(d, null, 2));
    writeFileSync(join(dir, 'index.html'), page);
  }
  const p = {
    dir,
    page: () => readFileSync(join(dir, 'index.html'), 'utf8'),
    data: (d2) => writeFileSync(join(dir, 'tools.json'), JSON.stringify(d2, null, 2)),
    // gh: { "<owner>/<name>": { name, archived, private, description } } for the stand-in gh.
    run(args = [], { gh = {} } = {}) {
      const ghFile = join(dir, 'gh-repos.json');
      const log = join(dir, 'gh-calls.log');
      writeFileSync(ghFile, JSON.stringify(gh));
      writeFileSync(log, '');
      // No GitHub token reaches the script: the stand-in needs none, and nothing here should be able to use one.
      const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(GH|GITHUB)_(ENTERPRISE_)?TOKEN$/i.test(k)));
      const r = spawnSync(process.execPath, ['--require', USE_GH, join(dir, 'scripts', 'build.mjs'), ...args], {
        cwd: dir, encoding: 'utf8', env: { ...env, GH_STAND_IN: ghFile, GH_STAND_IN_LOG: log },
      });
      const calls = readFileSync(log, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
      return { code: r.status, stdout: r.stdout, stderr: r.stderr, calls };
    },
  };
  return p;
}
