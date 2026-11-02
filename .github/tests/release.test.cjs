const assert = require('assert').strict;
const { ensureRelease, ensureManifest, updateEnvTag } = require('../scripts/release.cjs');
const { checkVersion } = require('../scripts/check-version.cjs');
const sha = 'a'.repeat(40);
const failure = (status, errors) => Object.assign(new Error('mock failure'), { status, response: { data: { errors } } });
const client = repos => ({ rest: { repos } });
const context = { repo: { owner: 'test', repo: 'frontend' } };
let checks = 0;
async function test(name, run) { await run(); checks++; console.log(`PASS ${name}`); }

(async () => {
  await test('existing Release is reused without creation or editing', async () => {
    const existing = { data: { id: 1, body: 'preserve manual notes' } };
    assert.equal(await ensureRelease(client({ getReleaseByTag: async () => existing }), context, 'v3.13.32'), existing);
  });
  await test('missing Release is created with generated notes', async () => {
    await ensureRelease(client({
      getReleaseByTag: async () => { throw failure(404); },
      createRelease: async args => { assert.equal(args.tag_name, 'v3.13.32'); assert.equal(args.generate_release_notes, true); },
    }), context, 'v3.13.32');
  });
  await test('concurrent already_exists conflict is re-read', async () => {
    let gets = 0;
    const result = await ensureRelease(client({
      getReleaseByTag: async () => { if (++gets === 1) throw failure(404); return 'existing'; },
      createRelease: async () => { throw failure(422, [{ resource: 'Release', field: 'tag_name', code: 'already_exists' }]); },
    }), context, 'v3.13.32');
    assert.equal(result, 'existing'); assert.equal(gets, 2);
  });
  await test('authorization and unrelated validation errors are not swallowed', async () => {
    await assert.rejects(ensureRelease(client({ getReleaseByTag: async () => { throw failure(401); } }), context, 'v3.13.32'));
    await assert.rejects(ensureRelease(client({
      getReleaseByTag: async () => { throw failure(404); },
      createRelease: async () => { throw failure(422, [{ resource: 'Release', field: 'body', code: 'invalid' }]); },
    }), context, 'v3.13.32'));
  });
  await test('existing draft Release cannot advance deployment', async () => {
    await assert.rejects(ensureRelease(client({ getReleaseByTag: async () => ({ data: { draft: true } }) }), context, 'v3.13.32'), /draft/);
  });
  // Shaped like manifests hosts/penguin-box/.env: comments (one mentions another key's sed), several tags, final newline.
  const env = tag => [
    '# Image tags of penguin-box (compose interpolation).',
    "#   sed -i 's/^BACKEND_TAG=.*/BACKEND_TAG=v3.15.0/' hosts/penguin-box/.env",
    '# FRONTEND_TAG=v0.0.1 in a comment is not a definition.',
    'BACKEND_TAG=v3.14.71',
    `FRONTEND_TAG=${tag}`,
    'MAINTENANCE_TAG=v1.2.0',
    'GOPKGSERVER_TAG=v0.0.8',
    '',
  ].join('\n');
  const decode = args => Buffer.from(args.content, 'base64').toString();
  function manifestClient(content, write = async () => { throw new Error('unexpected manifest write'); }) {
    return client({
      get: async () => ({ data: { default_branch: 'main' } }),
      getContent: async args => {
        assert.equal(args.owner, 'penguin-statistics'); assert.equal(args.repo, 'manifests');
        assert.equal(args.path, 'hosts/penguin-box/.env'); assert.equal(args.ref, 'main');
        const raw = Buffer.isBuffer(content) ? content : Buffer.from(content);
        return { data: { type: 'file', encoding: 'base64', sha: 'original-blob', content: raw.toString('base64') } };
      },
      createOrUpdateFileContents: write,
    });
  }
  await test('matching FRONTEND_TAG causes zero writes', async () => {
    const result = await ensureManifest(manifestClient(env('v3.13.43')), 'v3.13.43', sha);
    assert.equal(result.changed, false);
    assert.equal((await ensureManifest(manifestClient(env('v3.13.43')), 'v3.13.43', sha, { checkOnly: true })).changed, false);
  });
  await test('new version edits only the FRONTEND_TAG line of the box .env using blob SHA guard', async () => {
    let writes = 0;
    const result = await ensureManifest(manifestClient(env('v3.13.43'), async args => {
      writes++; assert.equal(args.sha, 'original-blob'); assert.equal(args.branch, 'main');
      assert.equal(args.owner, 'penguin-statistics'); assert.equal(args.repo, 'manifests');
      assert.equal(args.path, 'hosts/penguin-box/.env');
      assert.equal(args.message.split('\n')[0], 'hosts/penguin-box/.env: FRONTEND_TAG=v3.13.44');
      assert.ok(args.message.includes(`penguin-statistics/frontend-v2@${sha}`));
      assert.equal(decode(args), env('v3.13.44'));
    }), 'v3.13.44', sha);
    assert.equal(result.changed, true); assert.equal(writes, 1);
  });
  await test('check-only promotion plans a bump without writing', async () => {
    assert.equal((await ensureManifest(manifestClient(env('v3.13.43')), 'v3.13.44', sha, { checkOnly: true })).changed, true);
  });
  await test('every other byte is preserved (CRLF, no final newline, multi-digit bump)', async () => {
    const crlf = env('v3.13.43').replace(/\n/g, '\r\n');
    assert.equal(updateEnvTag(crlf, 'v3.13.44').content, crlf.replace('FRONTEND_TAG=v3.13.43\r\n', 'FRONTEND_TAG=v3.13.44\r\n'));
    assert.equal(updateEnvTag('A=1\nFRONTEND_TAG=v3.13.99', 'v3.14.0').content, 'A=1\nFRONTEND_TAG=v3.14.0');
    assert.deepEqual(updateEnvTag(env('v3.13.43'), 'v3.13.43'), { previous: 'v3.13.43', changed: false, content: env('v3.13.43') });
  });
  await test('missing FRONTEND_TAG line fails closed without writes', async () => {
    const missing = env('v3.13.43').replace(/^FRONTEND_TAG=.*\n/m, '');
    await assert.rejects(ensureManifest(manifestClient(missing), 'v3.13.44', sha), /exactly one FRONTEND_TAG= line.*found 0/);
    assert.throws(() => updateEnvTag('# FRONTEND_TAG=v3.13.43\nXFRONTEND_TAG=v3.13.43\nFRONTEND_TAGS=v1.0.0\n', 'v3.13.44'), /found 0/);
  });
  await test('duplicate or ambiguous FRONTEND_TAG definitions fail closed without writes', async () => {
    await assert.rejects(ensureManifest(manifestClient(env('v3.13.43') + 'FRONTEND_TAG=v3.13.43\n'), 'v3.13.44', sha), /found 2/);
    for (const extra of ['  FRONTEND_TAG=v3.13.43', 'export FRONTEND_TAG=v3.13.43', 'FRONTEND_TAG = v3.13.43']) {
      assert.throws(() => updateEnvTag(env('v3.13.43') + extra + '\n', 'v3.13.44'), /found 2/);
    }
  });
  await test('unexpected FRONTEND_TAG value or encoding fails closed', async () => {
    for (const line of ['FRONTEND_TAG=latest', 'FRONTEND_TAG="v3.13.43"', 'FRONTEND_TAG=v3.13.43 # pinned', 'FRONTEND_TAG=', 'export FRONTEND_TAG=v3.13.43']) {
      assert.throws(() => updateEnvTag(`A=1\n${line}\n`, 'v3.13.44'), /Unexpected FRONTEND_TAG= line/);
    }
    assert.throws(() => updateEnvTag(env('v3.13.43'), 'bad; injected'), /version/);
    const invalid = Buffer.concat([Buffer.from(env('v3.13.43')), Buffer.from([0xff, 0x0a])]);
    await assert.rejects(ensureManifest(manifestClient(invalid), 'v3.13.44', sha), /not valid UTF-8/);
  });
  await test('older version never moves a newer stable FRONTEND_TAG back', async () => {
    for (const [current, tag] of [['v3.13.44', 'v3.13.43'], ['v3.14.0', 'v3.13.99'], ['v4.0.0', 'v3.99.99']]) {
      await assert.rejects(ensureManifest(manifestClient(env(current)), tag, sha), /stale release/);
      await assert.rejects(ensureManifest(manifestClient(env(current)), tag, sha, { checkOnly: true }), /stale release/);
    }
  });
  await test('concurrent manifest modification fails without retry', async () => {
    let writes = 0, reads = 0;
    const github = manifestClient(env('v3.13.43'), async () => { writes++; throw failure(409); });
    const getContent = github.rest.repos.getContent;
    github.rest.repos.getContent = async args => { reads++; return getContent(args); };
    await assert.rejects(ensureManifest(github, 'v3.13.44', sha), { status: 409 });
    assert.equal(writes, 1); assert.equal(reads, 1);
  });
  await test('prerelease transitions require explicit review', async () => {
    await assert.rejects(ensureManifest(manifestClient(env('v3.13.43')), 'v3.13.44-rc.1', sha), /prerelease/);
    await assert.rejects(ensureManifest(manifestClient(env('v3.13.44-rc.1')), 'v3.13.44', sha), /prerelease/);
    assert.equal((await ensureManifest(manifestClient(env('v3.13.44-rc.1')), 'v3.13.44-rc.1', sha)).changed, false);
  });
  await test('new releases must match package version', async () => {
    assert.deepEqual(checkVersion('v3.13.32', sha, '3.13.32'), { legacy: false });
    assert.throws(() => checkVersion('v3.13.32', sha, '3.13.30'), /does not match/);
  });
  await test('only exact historical tag, commit and package version exception is accepted', async () => {
    assert.deepEqual(checkVersion('v3.13.31', 'ee01c44eec7687ac760ee051ae69f1135c331c2c', '3.13.30'), { legacy: true });
    assert.throws(() => checkVersion('v3.13.31', sha, '3.13.30'), /does not match/);
    assert.throws(() => checkVersion('v3.13.31', 'ee01c44eec7687ac760ee051ae69f1135c331c2c', '3.13.29'), /does not match/);
  });
  console.log(`${checks} local mock checks passed; no network requests made`);
})().catch(error => { console.error(error); process.exitCode = 1; });
