// Verifies tools.json rules, checks that index.html and app.js stay in sync with
// tools.json, and optionally validates live GitHub public/archived status via `gh`.
//
//   node scripts/verify-catalog.mjs --check
//   node scripts/verify-catalog.mjs --check --github
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OWNER = "Real-Fruit-Snacks";
const args = new Set(process.argv.slice(2));
const USAGE = "usage: node scripts/verify-catalog.mjs [--check] [--github] [--help]";

if (args.has("--help") || args.has("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const unknown = [...args].filter((a) => a !== "--check" && a !== "--github");
if (unknown.length) {
  console.error(`unknown option: ${unknown.join(" ")}\n${USAGE}`);
  process.exit(2);
}

const data = JSON.parse(readFileSync(join(ROOT, "tools.json"), "utf8"));
const html = readFileSync(join(ROOT, "index.html"), "utf8");
const js = readFileSync(join(ROOT, "app.js"), "utf8");
const plain = (s) => String(s).replaceAll("`", "");
const problems = [];

const seen = new Set();
for (const t of [...data.tools, ...data.around]) {
  if (seen.has(t.repo)) problems.push(`${t.repo}: listed twice`);
  seen.add(t.repo);
  if (!t.description) problems.push(`${t.repo}: missing description`);
  else if (/\.\s*$/.test(t.description)) problems.push(`${t.repo}: description ends with a period`);
  else if (t.description.length > 64) problems.push(`${t.repo}: description is ${t.description.length} chars (>64)`);
}

for (const t of data.tools) {
  for (const k of ["in", "out", "language"]) {
    if (!t[k]) problems.push(`${t.repo}: missing "${k}"`);
  }
  for (const k of ["in", "out"]) {
    if (t[k] && plain(t[k]).length > 40) {
      problems.push(`${t.repo}: "${k}" is ${plain(t[k]).length} chars (>40)`);
    }
  }
  if (!html.includes(`data-repo="${t.repo}"`)) {
    problems.push(`index.html missing active cue row data-repo="${t.repo}"`);
  }
  if (!js.includes(`"${t.repo}": {`)) {
    problems.push(`app.js missing TOOLS entry "${t.repo}"`);
  }
}

for (const r of data.retired) {
  if (!html.includes(`github.com/${OWNER}/${r}`)) {
    problems.push(`index.html missing retired archive link for ${r}`);
  }
  if (js.includes(`"${r}": {`)) {
    problems.push(`app.js still lists retired repo ${r} as an active tool`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(
  `catalog verified: ${data.tools.length} active tools, ${data.around.length} supporting repos, ${data.retired.length} retired repos`
);

if (args.has("--github")) {
  const gh = (r) =>
    JSON.parse(
      execFileSync("gh", ["api", `repos/${OWNER}/${r}`, "--jq", "{a: .archived, p: .private, n: .name}"], {
        encoding: "utf8",
      })
    );
  const fails = [];
  for (const t of [...data.tools, ...data.around]) {
    let r;
    try {
      r = gh(t.repo);
    } catch {
      fails.push(`${t.repo}: not found on GitHub`);
      continue;
    }
    if (r.n !== t.repo) fails.push(`${t.repo}: GitHub name is ${r.n}`);
    if (r.p) fails.push(`${t.repo}: repository is private`);
    if (r.a) fails.push(`${t.repo}: repository is archived; move to retired`);
  }
  for (const name of data.retired) {
    let r;
    try {
      r = gh(name);
    } catch {
      fails.push(`${name}: retired repo not found on GitHub`);
      continue;
    }
    if (r.p) fails.push(`${name}: retired repo is private`);
    if (!r.a) fails.push(`${name}: listed as retired but not archived`);
  }
  if (fails.length) {
    console.error(fails.join("\n"));
    process.exit(1);
  }
  console.log("GitHub check passed: every listed repo is public and status matches.");
}
