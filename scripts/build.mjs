// Writes tools.json into index.html, between the <!-- build:NAME --> and <!-- /build:NAME --> markers,
// so the whole list is in the page without JavaScript. No dependencies; Node 18 or later.
//
//   node scripts/build.mjs            rewrite index.html
//   node scripts/build.mjs --check    exit 1 if index.html is out of date (CI)
//   node scripts/build.mjs --github   also check every repo against GitHub with `gh`: listed tools are
//                                     public and not archived, retired ones are archived and public (CI)
//   node scripts/build.mjs --help     print the usage; any other option is refused with exit 2
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OWNER = 'Real-Fruit-Snacks';
const args = new Set(process.argv.slice(2));
const USAGE = 'usage: node scripts/build.mjs [--check] [--github]\n  (none)     rewrite index.html from tools.json\n  --check    exit 1 if index.html is out of date\n  --github   also check every repo against GitHub with gh';
if (args.has('--help') || args.has('-h')) { console.log(USAGE); process.exit(0); }
const unknown = [...args].filter((a) => a !== '--check' && a !== '--github');
if (unknown.length) { console.error(`unknown option: ${unknown.join(' ')}\n${USAGE}`); process.exit(2); }
const data = JSON.parse(readFileSync(join(ROOT, 'tools.json'), 'utf8'));
const problems = [];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// `backticks` become <code>; everything else is escaped text.
// Inside code, each space-separated token is a .w span, so the page can keep log lines and file names
// whole: they break at spaces, or after _ / and \ (a <wbr> between two spans), never at a hyphen.
const token = (w) => w.split(/(?<=[_/\\])/).map((p) => `<span class="w">${esc(p)}</span>`).join('<wbr>');
// In plain text, a hyphenated word (10-bit) is kept whole too.
const words = (s) => s.split(' ').map((w) => (w.includes('-') ? `<span class="w">${esc(w)}</span>` : esc(w))).join(' ');
const inline = (s) => String(s).split('`').map((part, i) => (i % 2 ? `<code>${part.split(' ').map(token).join(' ')}</code>` : words(part))).join('');
const plain = (s) => String(s).replaceAll('`', '');
const repoUrl = (r) => `https://github.com/${OWNER}/${encodeURIComponent(r)}`;
const pad = (n) => String(n).padStart(2, '0');

// ---- check the data ----
const seen = new Set();
for (const t of [...data.tools, ...data.around]) {
  if (seen.has(t.repo)) problems.push(`${t.repo} is listed twice`);
  seen.add(t.repo);
  if (!t.description) problems.push(`${t.repo} has no description`);
  else if (/\.\s*$/.test(t.description)) problems.push(`${t.repo}: description ends with a period`);
  else if (t.description.length > 64) problems.push(`${t.repo}: description is ${t.description.length} chars (keep it near 60)`);
}
for (const t of data.tools) {
  for (const k of ['in', 'out', 'language']) if (!t[k]) problems.push(`${t.repo} has no "${k}"`);
  for (const k of ['in', 'out']) if (t[k] && plain(t[k]).length > 40) problems.push(`${t.repo}: "${k}" is ${plain(t[k]).length} chars, the limit is 40`);
}
if (problems.length) { console.error(problems.map((p) => `tools.json: ${p}`).join('\n')); process.exit(1); }

// ---- the pieces ----
const meta = (t) => [t.language, t.platform].filter(Boolean).map(esc).join(' · ');

const board = data.tools.map((t, i) => {
  const href = t.site || repoUrl(t.repo);
  const id = `job-${t.repo.replace(/[^a-z0-9-]/gi, '-')}`;
  return `<li class="tool" data-repo="${esc(t.repo)}" data-site="${esc(href)}" data-src="${esc(repoUrl(t.repo))}">
  <a class="row" href="${esc(href)}" aria-describedby="${id}"><span class="no">${pad(i + 1)}</span><span class="name">${esc(t.repo)}</span><span class="lang">${esc(t.language)}</span></a>
  <div class="job" id="${id}">
    <p class="desc">${esc(t.description)}</p>
    <p class="io"><span class="k k-in">In</span> <span class="v-in">${inline(t.in)}</span></p>
    <p class="io"><span class="k k-out">Out</span> <span class="v-out">${inline(t.out)}</span></p>
    <p class="meta"><span class="m">${meta(t)}</span> <a href="${esc(repoUrl(t.repo))}">Source</a></p>
  </div>
</li>`;
}).join('\n');

const first = data.tools[0];
const display = `<div class="d-head"><span class="d-no">01</span><p class="d-name">${esc(first.repo)}</p><p class="d-meta">${meta(first)}</p></div>
<p class="d-desc">${esc(first.description)}</p>
<div class="d-job">
  <span class="k k-in">In</span>
  <p class="v v-in"><span class="dim">${inline(first.in)}</span><span class="lit">${inline(first.in)}</span></p>
  <span class="k k-out">Out</span>
  <p class="v v-out">${inline(first.out)}</p>
  <i class="seam"></i>
</div>
<p class="d-links"><a tabindex="-1" href="${esc(first.site || repoUrl(first.repo))}">${first.site ? 'Project page' : 'On GitHub'}</a><a tabindex="-1" href="${esc(repoUrl(first.repo))}">Source</a></p>`;

const around = data.around.map((t) => `<li><a href="${esc(t.site || repoUrl(t.repo))}">${esc(t.repo)}</a><span>${esc(t.description)}</span><a class="src" href="${esc(repoUrl(t.repo))}">Source</a></li>`).join('\n');

const retired = data.retired.map((r) => `<li><a href="${esc(repoUrl(r))}">${esc(r)}</a></li>`).join('');

const blocks = { board, display, around, retired, count: String(data.tools.length) };

// ---- write ----
const file = join(ROOT, 'index.html');
// Compare and build with LF; a checkout with CRLF (git's core.autocrlf on Windows) is written back with CRLF.
// Line endings alone never make the file out of date; a rewrite uses the ending most of its lines have.
const raw = readFileSync(file, 'utf8');
const crlf = (raw.match(/\r\n/g) || []).length;
const eol = crlf * 2 > (raw.match(/\n/g) || []).length ? '\r\n' : '\n';
const before = raw.replace(/\r\n/g, '\n');
let after = before;
for (const [name, html] of Object.entries(blocks)) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`, 'g');
  if (!re.test(after)) { console.error(`index.html has no <!-- build:${name} --> block`); process.exit(1); }
  const inlineBlock = name === 'count' || name === 'retired';
  after = after.replace(re, (_, a, b) => (inlineBlock ? `${a}${html}${b}` : `${a}\n${html}\n${b}`));
}

if (args.has('--check')) {
  if (after !== before) { console.error('index.html is out of date with tools.json: run node scripts/build.mjs'); process.exit(1); }
  console.log(`index.html matches tools.json (${data.tools.length} tools, ${data.around.length} around them, ${data.retired.length} retired)`);
} else if (after !== before) {
  writeFileSync(file, after.replace(/\n/g, eol));
  console.log(`wrote index.html (${data.tools.length} tools, ${data.around.length} around them, ${data.retired.length} retired)`);
} else {
  console.log('index.html already matches tools.json');
}

// ---- GitHub: is the list still true? ----
if (args.has('--github')) {
  const gh = (r) => JSON.parse(execFileSync('gh', ['api', `repos/${OWNER}/${r}`, '--jq', '{a: .archived, p: .private, d: .description, n: .name}'], { encoding: 'utf8' }));
  const fails = [];
  for (const t of [...data.tools, ...data.around]) {
    let r;
    try { r = gh(t.repo); } catch { fails.push(`${t.repo}: not found on GitHub`); continue; }
    if (r.n !== t.repo) fails.push(`${t.repo}: GitHub calls it ${r.n}`);
    if (r.p) fails.push(`${t.repo}: is private`);
    if (r.a) fails.push(`${t.repo}: is archived; move it to "retired"`);
    if (r.d !== t.description) console.log(`note: ${t.repo}: GitHub's description differs: ${JSON.stringify(r.d)}`);
  }
  for (const name of data.retired) {
    let r;
    try { r = gh(name); } catch { fails.push(`${name}: retired, but not found on GitHub`); continue; }
    if (r.p) fails.push(`${name}: retired, but private; the page links to it`);
    if (!r.a) fails.push(`${name}: listed as retired, but not archived`);
  }
  if (fails.length) { console.error(fails.join('\n')); process.exit(1); }
  console.log('every listed repo is public; tools are active, retired ones are archived');
}
