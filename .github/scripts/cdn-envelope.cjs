const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const { execFileSync } = require('child_process');
const { checkVersion } = require('./check-version.cjs');
const SITE = [
  '.well-known/security.txt', '.well-known/apple-app-site-association',
  'index.html', 'service-worker.js', 'manifest.json', 'browserconfig.xml', 'robots.txt', 'favicon.ico',
  'opensearch.xml', 'security.txt', '1000.html', '50x.html', 'under-deploy.html', 'update-browser.html',
  'compliance/privacy-zh.html', 'compliance/eula-zh.html',
  ...['favicon-16x16.png', 'favicon-32x32.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png',
    'apple-touch-icon.png', 'mstile-150x150.png', 'safari-pinned-tab.svg'].map(p => `favicon/${p}`),
].sort();
const MIME = { '.js': 'application/javascript', '.css': 'text/css', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
function assert(ok, message) { if (!ok) throw new Error(message); }
function checksums(files) {
  return Object.keys(files).sort().map(p => `${hash(files[p])}  ${p}\n`).join('');
}
function config(env = process.env) {
  const sourceSha = env.GITHUB_SHA;
  assert(/^[a-f0-9]{40}$/.test(sourceSha || ''), 'Full source SHA required');
  const origin = new URL(env.PENGUIN_STATIC_CDN_ORIGIN);
  assert(origin.protocol === 'https:' && origin.href === `${origin.origin}/`, 'CDN must be a bare HTTPS origin');
  const corsOrigins = JSON.parse(env.PENGUIN_SITE_ORIGINS || '[]');
  assert(Array.isArray(corsOrigins) && corsOrigins.length > 0, 'At least one site origin required');
  for (const value of corsOrigins) {
    const url = new URL(value);
    assert(url.protocol === 'https:' && value === url.origin, 'Site origins must be bare HTTPS origins without trailing slash');
  }
  const packageVersion = require('../../package.json').version;
  const releaseTag = env.RELEASE_TAG || env.GITHUB_REF_NAME;
  // Mainland-only tags avoid the v* workflow that promotes the global frontend.
  if (typeof releaseTag === 'string' && releaseTag.startsWith('cn-')) {
    const mainland = /^cn-(v\d+\.\d+\.\d+)-([1-9]\d*)$/.exec(releaseTag);
    assert(mainland && mainland[1] === `v${packageVersion}`, 'Mainland release tag must match package version and have a positive sequence');
  } else checkVersion(releaseTag, sourceSha, packageVersion);
  assert(/^\d+$/.test(env.GITHUB_RUN_ID || '') && /^\d+$/.test(env.GITHUB_RUN_ATTEMPT || ''), 'CI run identity required');
  return { schemaVersion: 1, repository: 'penguin-statistics/frontend-v2', sourceSha,
    releaseTag, packageVersion,
    cdnPrefix: `${origin.origin}/frontend-v2/releases/${sourceSha}/`, corsOrigins,
    workflowRunId: env.GITHUB_RUN_ID, workflowRunAttempt: env.GITHUB_RUN_ATTEMPT };
}
function collect(dist, cfg) {
  const all = {};
  function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = prefix + entry.name;
      assert(/^[A-Za-z0-9_.\/-]+$/.test(p) && !p.split('/').some(x => x === '..' || x === '.'), `Unsafe path: ${p}`);
      if (entry.isDirectory()) walk(path.join(dir, entry.name), p + '/');
      else {
        assert(entry.isFile(), `Non-regular file: ${p}`);
        all[p] = fs.readFileSync(path.join(dir, entry.name));
      }
    }
  }
  walk(dist);
  const site = {}, assets = {};
  for (const p of SITE) { assert(all[p], `Missing site file: ${p}`); site[`site/${p}`] = all[p]; }
  for (const [p, data] of Object.entries(all)) {
    if (SITE.includes(p) || p.endsWith('.map')) continue; // Source maps are never public artifacts.
    assert(/^(js|css|fonts|img)\//.test(p) && MIME[path.extname(p)], `Unclassified build output: ${p}`);
    assets[p] = data;
  }
  assert(Object.keys(assets).some(p => p.startsWith('js/')) && Object.keys(assets).some(p => p.startsWith('css/')), 'Missing bundles');
  const html = all['index.html'].toString();
  let references = 0;
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const url = match[1];
    if (/\.(js|css)(?:[?#]|$)/.test(url) && !url.startsWith('https://client.crisp.chat/')) {
      assert(url.startsWith(cfg.cdnPrefix) && assets[url.slice(cfg.cdnPrefix.length)], `Bundle not in this CDN release: ${url}`);
      references++;
    }
  }
  assert(references > 0, 'No CDN bundle references in HTML');
  assert(Object.entries(assets).some(([p, b]) => p.endsWith('.js') && b.includes(Buffer.from(cfg.cdnPrefix))), 'Missing lazy-chunk CDN runtime prefix');
  assert(all['service-worker.js'].equals(fs.readFileSync(path.resolve(__dirname, '../../public/service-worker.js'))), 'Unexpected service worker dependencies');
  return { site, assets };
}
function request(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers, timeout: 30000 }, res => {
      const chunks = []; let size = 0;
      res.on('data', chunk => { size += chunk.length; if (size > 64 * 1024 * 1024) res.destroy(new Error('Response too large')); else chunks.push(chunk); });
      res.on('error', () => reject(new Error('HTTP response failed')));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('timeout', () => req.destroy());
    req.on('error', () => reject(new Error('HTTPS request failed')));
    req.end(body);
  });
}
function upyun(env, sdk = require('../s3/node_modules/@aws-sdk/client-s3')) {
  const { UPYUN_SERVICE: service, UPYUN_S3_ACCESS_KEY_ID: accessKeyId, UPYUN_S3_SECRET_ACCESS_KEY: secretAccessKey } = env;
  assert(/^[a-z0-9][a-z0-9-]*$/.test(service || '') && accessKeyId && secretAccessKey,
    'UPYUN_SERVICE, UPYUN_S3_ACCESS_KEY_ID and UPYUN_S3_SECRET_ACCESS_KEY required');
  const client = new sdk.S3Client({ endpoint: 'https://s3.api.upyun.com', region: 'us-east-1', forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey }, maxAttempts: 3,
    requestHandler: { connectionTimeout: 10000, requestTimeout: 30000 },
    requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED' });
  return async (method, key, body, type) => {
    assert(method === 'GET' || method === 'PUT', 'Only object reads and uploads are supported');
    try {
      const input = { Bucket: service, Key: key };
      const result = await client.send(method === 'GET' ? new sdk.GetObjectCommand(input) : new sdk.PutObjectCommand({
        ...input, Body: body, ContentLength: body.length, ContentType: type,
        CacheControl: 'public, max-age=31536000, immutable',
      }));
      const chunks = []; let size = 0;
      if (method === 'GET') for await (const chunk of result.Body) {
        size += chunk.length;
        if (size > 64 * 1024 * 1024) { result.Body.destroy?.(); throw new Error('Object too large'); }
        chunks.push(chunk);
      }
      return { status: result.$metadata.httpStatusCode, body: Buffer.concat(chunks) };
    } catch (error) {
      // A missing bucket or denied read is never evidence that an object may be written.
      if (method === 'GET' && error.name === 'NoSuchKey' && error.$metadata?.httpStatusCode === 404) return { status: 404 };
      throw new Error(`S3 ${method} failed (${error.$metadata?.httpStatusCode || 'transport'})`);
    }
  };
}
async function publish({ cfg, files, output, storage, publicGet = request, now = () => new Date().toISOString() }) {
  assert(!fs.existsSync(output), 'Output already exists; use a fresh staging directory');
  const prefix = new URL(cfg.cdnPrefix).pathname.slice(1);
  const assetManifest = checksums(files.assets);
  const siteManifest = checksums(files.site);
  // Reserve the entire build (including HTML) first: a non-identical rerun fails even after a partial upload.
  const lock = Buffer.from(JSON.stringify({ sourceSha: cfg.sourceSha, releaseTag: cfg.releaseTag,
    packageVersion: cfg.packageVersion, cdnPrefix: cfg.cdnPrefix,
    assetManifestSha256: hash(assetManifest), siteManifestSha256: hash(siteManifest) }) + '\n');
  const objects = { 'release-lock.json': lock, ...files.assets };
  const missing = [];
  for (const [p, data] of Object.entries(objects)) {
    const result = await storage('GET', prefix + p);
    if (result.status === 404) missing.push(p);
    else { assert(result.status === 200, `Storage read failed (${result.status}): ${p}`);
      assert(hash(result.body) === hash(data), `Immutable release conflict: ${p}`); }
  }
  for (const p of missing) {
    const result = await storage('PUT', prefix + p, objects[p], MIME[path.extname(p)] || 'application/json');
    assert(result.status === 200, `Storage upload failed (${result.status}): ${p}`);
  }
  // No redirects or content transforms accepted. Check every runtime asset for every configured site origin.
  for (const [p, data] of Object.entries(files.assets)) {
    for (const origin of cfg.corsOrigins) {
      const result = await publicGet(cfg.cdnPrefix + p, { headers: { Origin: origin, 'Accept-Encoding': 'identity' } });
      assert(result.status === 200, `CDN GET failed (${result.status}): ${p}`);
      assert(hash(result.body) === hash(data), `CDN content mismatch: ${p}`);
      const type = (result.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      assert(type === MIME[path.extname(p)] || (p.endsWith('.js') && type === 'text/javascript'), `CDN MIME mismatch: ${p}`);
      const cors = result.headers['access-control-allow-origin'];
      assert(cors === '*' || cors === origin, `CDN CORS mismatch: ${p}`);
      if (cors !== '*') assert((result.headers.vary || '').toLowerCase().split(',').map(s => s.trim()).includes('origin'), `CDN must vary by Origin: ${p}`);
    }
  }
  const { corsOrigins, ...identity } = cfg;
  const release = { ...identity, assetManifestSha256: hash(assetManifest), siteManifestSha256: hash(siteManifest) };
  const verification = { schemaVersion: 1, status: 'passed', sourceSha: cfg.sourceSha, cdnPrefix: cfg.cdnPrefix,
    assetManifestSha256: release.assetManifestSha256, verifiedAt: now(), verifiedAssetCount: Object.keys(files.assets).length, corsOrigins };
  const finalFiles = { ...files.site, 'release.json': Buffer.from(JSON.stringify(release, null, 2) + '\n'),
    'cdn-verification.json': Buffer.from(JSON.stringify(verification, null, 2) + '\n') };
  // Only materialize a deployable envelope after all public checks pass.
  for (const [p, data] of Object.entries(finalFiles)) {
    fs.mkdirSync(path.dirname(path.join(output, p)), { recursive: true }); fs.writeFileSync(path.join(output, p), data);
  }
  fs.writeFileSync(path.join(output, 'SHA256SUMS'), checksums(finalFiles));
  return release;
}
function archiveEnvelope(output, archive) {
  assert(!fs.existsSync(archive), 'Archive already exists');
  execFileSync('/usr/bin/tar', ['-czf', archive, '-C', output, ...['SHA256SUMS', 'cdn-verification.json', 'release.json', ...SITE.map(p => `site/${p}`)].sort()], {
    // tar may invoke gzip: neither it nor tar may inherit a repository-controlled PATH.
    env: { PATH: '/usr/bin:/bin', LANG: 'C', COPYFILE_DISABLE: '1' },
  });
  fs.writeFileSync(`${archive}.sha256`, `${hash(fs.readFileSync(archive))}  ${path.basename(archive)}\n`);
}
async function main() {
  const cfg = config();
  if (process.argv[2] === 'prefix') { process.stdout.write(cfg.cdnPrefix); return; }
  const files = collect('dist', cfg);
  if (process.argv[2] === 'check') { console.log(`Validated ${Object.keys(files.assets).length} CDN assets and ${SITE.length} site files (no upload)`); return; }
  assert(process.argv[2] === 'publish', 'Use prefix, check or publish');
  assert(process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_EVENT_NAME === 'push' && process.env.GITHUB_REF_TYPE === 'tag', 'Publishing requires a CI tag push');
  const output = 'cdn-envelope';
  await publish({ cfg, files, output, storage: upyun(process.env) });
  const archive = `frontend-envelope-${cfg.sourceSha}.tar.gz`;
  archiveEnvelope(output, archive);
  console.log(`Verified envelope: ${archive}`);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { SITE, MIME, hash, checksums, config, collect, upyun, publish, archiveEnvelope };
