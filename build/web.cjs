const { spawnSync } = require('child_process');

function buildWeb({ env = process.env, argv = process.argv, version = process.version, run = spawnSync } = {}) {
  const execute = (command, args, options = {}) => {
    const result = run(command, args, { stdio: 'inherit', env, ...options });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.signal})`);
    return result;
  };
  const pages = env.CF_PAGES === '1' && ['1', 'true'].includes(env.SKIP_DEPENDENCY_INSTALL);
  if (pages && !argv.includes('--pages-install')) {
    // Pages' tool initializer requires a modern Node for its current Corepack.
    // Run the actual frozen install and Vue build on our existing Node 16 baseline.
    execute('npm', ['exec', '--yes', '--package=node@16.20.2', '--package=yarn@1.22.22', '--', 'node', __filename, '--pages-install']);
    return;
  }
  if (pages) {
    if (version !== 'v16.20.2') throw new Error('Pages application build requires Node 16.20.2');
    const yarn = execute('yarn', ['--version'], { stdio: 'pipe', encoding: 'utf8' });
    if (yarn.stdout.trim() !== '1.22.22') throw new Error('Pages application build requires Yarn 1.22.22');
    console.log(`Pages application build: Node ${version}, Yarn ${yarn.stdout.trim()}`);
    execute('yarn', ['install', '--frozen-lockfile']);
  }
  execute('yarn', ['run', 'build:web:base']);
}
if (require.main === module) {
  try { buildWeb(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { buildWeb };
