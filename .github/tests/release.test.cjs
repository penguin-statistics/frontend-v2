const assert = require('assert').strict;
const { ensureRelease, ensureManifest, updateImageTag } = require('../scripts/release.cjs');
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
  function manifestClient(content, write) {
    return client({
      get: async () => ({ data: { default_branch: 'main' } }),
      getContent: async args => {
        assert.equal(args.owner, 'penguin-statistics'); assert.equal(args.repo, 'manifests');
        assert.equal(args.path, 'applications/frontend-rollout/values-prod.yaml'); assert.equal(args.ref, 'main');
        return { data: { type: 'file', encoding: 'base64', sha: 'original-blob', content: Buffer.from(content).toString('base64') } };
      },
      createOrUpdateFileContents: write,
    });
  }
  await test('matching manifest causes zero writes', async () => {
    const result = await ensureManifest(manifestClient('image:\n  tag: v3.13.32\n'), 'v3.13.32', sha);
    assert.equal(result.changed, false);
  });
  await test('new version updates only intended path using blob SHA guard', async () => {
    let writes = 0;
    const result = await ensureManifest(manifestClient('image:\n  tag: v3.13.31\n', async args => {
      writes++; assert.equal(args.sha, 'original-blob'); assert.equal(args.branch, 'main');
      assert.equal(args.path, 'applications/frontend-rollout/values-prod.yaml');
      assert.equal(Buffer.from(args.content, 'base64').toString(), 'image:\n  tag: v3.13.32\n');
    }), 'v3.13.32', sha);
    assert.equal(result.changed, true); assert.equal(writes, 1);
  });
  await test('concurrent manifest modification fails without retry', async () => {
    let writes = 0;
    await assert.rejects(ensureManifest(manifestClient('image:\n  tag: v3.13.31\n', async () => { writes++; throw failure(409); }), 'v3.13.32', sha));
    assert.equal(writes, 1);
  });
  await test('stale versions and unexpected manifest schema fail closed', async () => {
    await assert.rejects(ensureManifest(manifestClient('image:\n  tag: v3.13.33\n'), 'v3.13.32', sha), /stale release/);
    assert.throws(() => updateImageTag('image:\n  tag: v3.13.31\nother: true\n', 'v3.13.32'), /schema/);
    assert.throws(() => updateImageTag('image:\n  tag: v3.13.31\n', 'bad; injected'), /version/);
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
