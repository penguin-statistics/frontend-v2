const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { findImage, planImage } = require('../scripts/release-image.cjs');
const { ensureManifest } = require('../scripts/release.cjs');
const digest = `sha256:${'a'.repeat(64)}`;
const context = { repo: { owner: 'test', repo: 'frontend' }, actor: 'mock', token: 'mock-only' };
const missing = { status: 404, body: { errors: [{ code: 'MANIFEST_UNKNOWN' }] } };
const failure = status => Object.assign(new Error('mock'), { status });
let checks = 0;
async function test(name, run) { await run(); checks++; console.log(`PASS ${name}`); }
function http(result, authStatus = 200) {
  let calls = 0;
  return async (url, options) => {
    calls++;
    assert.equal(options.redirect, 'error');
    if (calls === 1) {
      assert.equal(url, 'https://ghcr.io/token?service=ghcr.io&scope=repository:penguin-statistics/frontend-v2:pull');
      return { ok: authStatus === 200, status: authStatus, json: async () => ({ token: 'mock-bearer' }) };
    }
    assert.equal(calls, 2);
    assert.match(url, /^https:\/\/ghcr.io\/v2\/penguin-statistics\/frontend-v2\/manifests\/v/);
    return { ok: result.status === 200, status: result.status, json: async () => result.body, headers: { get: () => result.digest } };
  };
}
const unpublished = { rest: { repos: { getReleaseByTag: async () => { throw failure(404); } } } };
(async () => {
  await test('existing same-tag image is reused without consulting or creating a release', async () => {
    assert.deepEqual(await planImage({}, context, 'v3.13.32', false, http({ status: 200, digest })), { build: false, digest });
    assert.deepEqual(await planImage({}, context, 'v3.13.32', true, http({ status: 200, digest })), { build: false, digest });
  });
  await test('only confirmed missing unpublished and undeployed image can be built', async () => {
    assert.deepEqual(await planImage(unpublished, context, 'v3.13.32', true, http(missing)), { build: true });
    await assert.rejects(planImage(unpublished, context, 'v3.13.32', false, http(missing)), /Deployed image is missing/);
    for (const draft of [true, false]) {
      const published = { rest: { repos: { getReleaseByTag: async () => ({ data: { draft } }) } } };
      await assert.rejects(planImage(published, context, 'v3.13.32', true, http(missing)), /Release has no image/);
    }
  });
  await test('auth, rate limit, server and ambiguous not-found errors never permit a build', async () => {
    await assert.rejects(findImage('v3.13.32', 'mock', 'mock', http(missing, 401)), /authentication failed/);
    for (const status of [401, 403, 429, 500]) {
      await assert.rejects(planImage(unpublished, context, 'v3.13.32', true, http({ status })), /lookup failed/);
    }
    for (const body of [{}, { errors: [{ code: 'NAME_UNKNOWN' }] }, { errors: [{ code: 'MANIFEST_UNKNOWN' }, { code: 'DENIED' }] }]) {
      await assert.rejects(planImage(unpublished, context, 'v3.13.32', true, http({ status: 404, body })), /unexpected/);
    }
    await assert.rejects(planImage(unpublished, context, 'v3.13.32', true, async () => { throw new Error('transport'); }), /transport/);
    await assert.rejects(planImage(unpublished, context, 'v3.13.32', true, http({ status: 200, digest: 'invalid' })), /digest/);
    const forbidden = { rest: { repos: { getReleaseByTag: async () => { throw failure(403); } } } };
    await assert.rejects(planImage(forbidden, context, 'v3.13.32', true, http(missing)), { status: 403 });
  });
  function manifests(initial) {
    let tag = initial, revision = 0, writes = 0;
    return {
      github: { rest: { repos: {
        get: async () => ({ data: { default_branch: 'main' } }),
        getContent: async () => ({ data: { type: 'file', encoding: 'base64', sha: String(revision), content: Buffer.from(`image:\n  tag: ${tag}\n`).toString('base64') } }),
        createOrUpdateFileContents: async args => {
          assert.equal(args.sha, String(revision));
          tag = Buffer.from(args.content, 'base64').toString().match(/tag: (\S+)/)[1];
          revision++; writes++;
        },
      } } },
      tag: () => tag, writes: () => writes,
    };
  }
  await test('old-tag rerun fails preflight before registry access or manifest writes', async () => {
    const state = manifests('v3.13.33');
    let registryCalls = 0;
    await assert.rejects((async () => {
      const plan = await ensureManifest(state.github, 'v3.13.32', 'a'.repeat(40), { checkOnly: true });
      await planImage(unpublished, context, 'v3.13.32', plan.changed, async () => { registryCalls++; });
    })(), /stale/);
    assert.equal(registryCalls, 0); assert.equal(state.writes(), 0);
  });
  await test('serialized different tags remain monotonic in either scheduling order', async () => {
    for (const order of [['v3.13.32', 'v3.13.33'], ['v3.13.33', 'v3.13.32']]) {
      const state = manifests('v3.13.31');
      for (const tag of order) {
        const run = async () => {
          const before = state.writes();
          await ensureManifest(state.github, tag, 'a'.repeat(40), { checkOnly: true });
          assert.equal(state.writes(), before);
          await ensureManifest(state.github, tag, 'a'.repeat(40));
        };
        if (state.tag() > tag) await assert.rejects(run(), /stale/);
        else await run();
      }
      assert.equal(state.tag(), 'v3.13.33');
    }
  });
  await test('final promotion rechecks state even if an earlier preflight was allowed', async () => {
    const state = manifests('v3.13.31');
    await ensureManifest(state.github, 'v3.13.32', 'a'.repeat(40), { checkOnly: true });
    await ensureManifest(state.github, 'v3.13.33', 'a'.repeat(40));
    await assert.rejects(ensureManifest(state.github, 'v3.13.32', 'a'.repeat(40)), /stale/);
    assert.equal(state.tag(), 'v3.13.33'); assert.equal(state.writes(), 1);
  });
  await test('workflow serializes tags and gates all image writes on reuse decision', async () => {
    const workflow = fs.readFileSync(path.join(__dirname, '../workflows/build-release.yml'), 'utf8');
    assert.match(workflow, /concurrency:\n  group: frontend-production-release\n  cancel-in-progress: false/);
    assert.doesNotMatch(workflow, /:latest|latest=|docker\/metadata-action|actions\/ghcr-docker/);
    for (const step of ['Setup Buildx', 'Login', 'Publish New Version Only']) {
      assert.ok(workflow.includes(`- name: "Docker: ${step}"\n        if: steps.image.outputs.build == 'true'`));
    }
    assert.match(workflow, /tags: ghcr\.io\/penguin-statistics\/frontend-v2:\$\{\{ steps\.git-meta\.outputs\.version \}\}\n/);
    assert.equal((workflow.match(/\n          tags:/g) || []).length, 1);
    assert.ok(workflow.indexOf('Manifest: Check Promotion') < workflow.indexOf('Docker: Reuse Existing Version'));
    assert.ok(workflow.indexOf('Docker: Reuse Existing Version') < workflow.indexOf('Docker: Publish New Version Only'));
    assert.ok(workflow.indexOf('Docker: Publish New Version Only') < workflow.indexOf('Manifest: Ensure Frontend Version'));
    assert.ok(workflow.includes('{ checkOnly: true }'));
    assert.ok(workflow.includes('await ensureManifest(github, process.env.RELEASE_TAG, context.sha);'));
  });
  console.log(`${checks} image recovery checks passed; no network requests made`);
})().catch(error => { console.error(error); process.exitCode = 1; });
