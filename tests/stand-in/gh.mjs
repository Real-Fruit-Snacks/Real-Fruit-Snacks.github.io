// A stand-in for `gh`, for the --github tests. It answers only what build.mjs asks:
//
//   gh api repos/<owner>/<name> --jq '{a: .archived, p: .private, d: .description, n: .name}'
//
// from the JSON file in GH_STAND_IN: { "<owner>/<name>": { "name": ..., "archived": ..., ... } }.
// A repo that isn't in the file is a 404, the way gh reports one. Every call is appended to the file in
// GH_STAND_IN_LOG, one JSON array of arguments per line, so a test can see what was asked.
import { appendFileSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);
if (process.env.GH_STAND_IN_LOG) appendFileSync(process.env.GH_STAND_IN_LOG, `${JSON.stringify(args)}\n`);

const fail = (msg) => { process.stderr.write(`${msg}\n`); process.exit(1); };
const [cmd, path, ...rest] = args;
if (cmd !== 'api' || !path) fail(`stand-in gh: only "gh api <path>" is supported, not: gh ${args.join(' ')}`);
const repos = JSON.parse(readFileSync(process.env.GH_STAND_IN, 'utf8'));
const m = path.match(/^repos\/([^/]+\/[^/]+)$/);
const repo = m && repos[decodeURIComponent(m[1])];
if (!repo) fail('gh: Not Found (HTTP 404)');

let out = repo;
const jq = rest[rest.indexOf('--jq') + 1];
if (rest.includes('--jq')) {
  // Only the object form build.mjs uses: {key: .field, ...}
  const body = jq.trim().match(/^\{(.*)\}$/);
  if (!body) fail(`stand-in gh: unsupported --jq: ${jq}`);
  out = {};
  for (const pair of body[1].split(',')) {
    const [k, f] = pair.split(':').map((s) => s.trim());
    if (!/^\.\w+$/.test(f)) fail(`stand-in gh: unsupported --jq field: ${pair}`);
    out[k] = repo[f.slice(1)] ?? null;
  }
}
process.stdout.write(`${JSON.stringify(out)}\n`);
