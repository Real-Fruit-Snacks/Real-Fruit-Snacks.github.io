// Loaded with --require into the build.mjs process the tests start: it sends execFileSync('gh', ...) to the
// stand-in in gh.mjs, so the tests never reach the real gh. (A gh on PATH would do on Linux, but on Windows
// execFileSync finds only gh.exe, so the stand-in goes in here instead; build.mjs is the same either way.)
const cp = require('node:child_process');
const { syncBuiltinESMExports } = require('node:module');
const { join } = require('node:path');

const real = cp.execFileSync;
const standIn = join(__dirname, 'gh.mjs');
cp.execFileSync = function execFileSync(file, args, options) {
  if (file === 'gh') return real.call(this, process.execPath, [standIn, ...(args || [])], options);
  return real.call(this, file, args, options);
};
syncBuiltinESMExports();
