const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { SITE, hash, checksums, config, collect, sign, publish } = require('../scripts/cdn-envelope.cjs');
const publicPath = require('../../build/public-path');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cdn-envelope-test-'));
const env = { GITHUB_SHA: 'a'.repeat(40), GITHUB_REF_NAME: `v${require('../../package.json').version}`,
  GITHUB_RUN_ID: '1', GITHUB_RUN_ATTEMPT: '1', PENGUIN_STATIC_CDN_ORIGIN: 'https://cdn.example.invalid',
  PENGUIN_SITE_ORIGINS: '["https://penguin-stats.cn"]' };
const cfg = config(env);
const files = { site: { 'site/index.html': Buffer.from('html') }, assets: { 'js/a.js': Buffer.from('js'), 'css/a.css': Buffer.from('css') } };
let count = 0;
async function test(name, fn) { await fn(); count++; console.log(`ok ${count} - ${name}`); }
function mock() {
  const objects = new Map(); let writes = 0;
  return { objects, get writes() { return writes; },
    storage: async (method, key, data) => {
      if (method === 'PUT') { objects.set(key, data); writes++; return { status: 200 }; }
      return objects.has(key) ? { status: 200, body: objects.get(key) } : { status: 404 };
    },
    publicGet: async url => { const p = url.slice(cfg.cdnPrefix.length); return { status: 200, body: files.assets[p],
      headers: { 'content-type': p.endsWith('.js') ? 'application/javascript; charset=utf-8' : 'text/css', 'access-control-allow-origin': '*' } }; },
  };
}
async function run() {
  await test('official Upyun signature vector', () => assert.equal(sign('PUT', '/upyun-temp/demo.jpg', 'Wed, 09 Nov 2016 14:26:58 GMT', 'password123', Buffer.from('abcdefg')), 'YUaAZX+WNAcJdNGHS5SBlITME5A='));
  await test('public path only affects production web, validates HTTPS', () => {
    assert.equal(publicPath({ PENGUIN_STATIC_PUBLIC_PATH: cfg.cdnPrefix }), '/');
    assert.equal(publicPath({ NODE_ENV: 'production', PENGUIN_PLATFORM: 'web', PENGUIN_STATIC_PUBLIC_PATH: cfg.cdnPrefix }), cfg.cdnPrefix);
    assert.throws(() => publicPath({ NODE_ENV: 'production', PENGUIN_PLATFORM: 'web', PENGUIN_STATIC_PUBLIC_PATH: 'http://bad/' }));
  });
  await test('identity validation rejects tag mismatch, credentials, paths and missing origins', () => {
    for (const change of [{ GITHUB_REF_NAME: 'v0.0.0' }, { PENGUIN_STATIC_CDN_ORIGIN: 'https://u:p@cdn.invalid' }, { PENGUIN_STATIC_CDN_ORIGIN: 'https://cdn.invalid/path' }, { PENGUIN_SITE_ORIGINS: '[]' }]) assert.throws(() => config({ ...env, ...change }));
  });
  await test('checksums use sorted paths, two spaces, LF including final LF', () => {
    assert.equal(checksums({ 'site/b': Buffer.from('b'), 'site/a': Buffer.from('a') }), `${hash('a')}  site/a\n${hash('b')}  site/b\n`);
  });
  await test('successful verification produces exact metadata and matching checksums', async () => {
    const m = mock(), output = path.join(root, 'success');
    const release = await publish({ cfg, files, output, ...m });
    assert.equal(release.siteManifestSha256, hash(checksums(files.site)));
    assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'cdn-verification.json'))).status, 'passed');
    assert.equal(m.objects.size, 3);
  });
  await test('identical rerun does not PUT and still checks CDN', async () => {
    const m = mock();
    await publish({ cfg, files, output: path.join(root, 'rerun1'), ...m });
    const writes = m.writes;
    await publish({ cfg, files, output: path.join(root, 'rerun2'), ...m });
    assert.equal(m.writes, writes);
  });
  await test('different HTML for the same SHA is blocked by the release lock', async () => {
    const m = mock();
    await publish({ cfg, files, output: path.join(root, 'lock1'), ...m });
    await assert.rejects(publish({ cfg, files: { ...files, site: { 'site/index.html': Buffer.from('changed') } }, output: path.join(root, 'lock2'), ...m }), /Immutable release conflict/);
    assert(!fs.existsSync(path.join(root, 'lock2')));
  });
  await test('existing different assets fail before any PUT', async () => {
    const m = mock(); m.objects.set(new URL(cfg.cdnPrefix).pathname.slice(1) + 'js/a.js', Buffer.from('wrong'));
    await assert.rejects(publish({ cfg, files, output: path.join(root, 'conflict'), ...m }), /Immutable release conflict/);
    assert.equal(m.writes, 0);
  });
  for (const status of [401, 403, 500]) await test(`storage ${status} is not absence`, async () => {
    const m = mock();
    await assert.rejects(publish({ cfg, files, output: path.join(root, `status${status}`), ...m, storage: async () => ({ status }) }), /Storage read failed/);
    assert.equal(m.writes, 0);
  });
  await test('partial upload retry resumes without changing the reserved build', async () => {
    const m = mock(); let puts = 0;
    await assert.rejects(publish({ cfg, files, output: path.join(root, 'partial1'), ...m, storage: async (...args) => {
      if (args[0] === 'PUT' && ++puts === 2) return { status: 503 };
      return m.storage(...args);
    } }), /upload failed/);
    assert(!fs.existsSync(path.join(root, 'partial1')));
    await publish({ cfg, files, output: path.join(root, 'partial2'), ...m });
    assert.equal(m.objects.size, 3);
  });
  for (const failure of ['status', 'body', 'mime', 'cors', 'vary']) await test(`CDN ${failure} failure yields no envelope`, async () => {
    const m = mock(), output = path.join(root, failure);
    await assert.rejects(publish({ cfg, files, output, ...m, publicGet: async (...args) => {
      const r = await m.publicGet(...args);
      if (failure === 'status') r.status = 302;
      if (failure === 'body') r.body = Buffer.from('bad');
      if (failure === 'mime') r.headers['content-type'] = 'text/html';
      if (failure === 'cors') delete r.headers['access-control-allow-origin'];
      if (failure === 'vary') r.headers['access-control-allow-origin'] = cfg.corsOrigins[0];
      return r;
    } }));
    assert(!fs.existsSync(output));
  });
  await test('build classifier excludes source maps, enforces CDN HTML and refuses symlinks', () => {
    const dist = path.join(root, 'dist');
    for (const p of SITE) { fs.mkdirSync(path.dirname(path.join(dist, p)), { recursive: true }); fs.writeFileSync(path.join(dist, p), p); }
    fs.copyFileSync(path.resolve(__dirname, '../../public/service-worker.js'), path.join(dist, 'service-worker.js'));
    fs.mkdirSync(path.join(dist, 'js')); fs.mkdirSync(path.join(dist, 'css'));
    fs.writeFileSync(path.join(dist, 'js/a.js'), cfg.cdnPrefix);
    fs.writeFileSync(path.join(dist, 'js/a.js.map'), 'private map');
    fs.writeFileSync(path.join(dist, 'css/a.css'), 'css');
    fs.writeFileSync(path.join(dist, 'index.html'), `<script src="${cfg.cdnPrefix}js/a.js"></script><link href="${cfg.cdnPrefix}css/a.css">`);
    assert.equal(Object.keys(collect(dist, cfg).assets).length, 2);
    fs.symlinkSync('a.js', path.join(dist, 'js/link.js'));
    assert.throws(() => collect(dist, cfg), /Non-regular/);
    fs.unlinkSync(path.join(dist, 'js/link.js'));
    fs.writeFileSync(path.join(dist, 'index.html'), '<script src="/js/a.js"></script>');
    assert.throws(() => collect(dist, cfg), /Bundle not in this CDN release/);
  });
}
run().then(() => console.log(`${count} tests passed`)).catch(e => { console.error(e); process.exitCode = 1; }).finally(() => fs.rmSync(root, { recursive: true, force: true }));
