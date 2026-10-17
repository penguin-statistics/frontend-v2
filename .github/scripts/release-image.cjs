const { validVersion } = require('./release.cjs');
const repository = 'penguin-statistics/frontend-v2';

// Called by github-script (Node 20). Tests inject fetch; never contact a registry.
async function findImage(tag, actor, token, request = globalThis.fetch) {
  validVersion(tag);
  if (!actor || !token) throw new Error('Registry read authentication is required');
  const basicAuth = Buffer.from(`${actor}:${token}`).toString('base64');
  const auth = await request(`https://ghcr.io/token?service=ghcr.io&scope=repository:${repository}:pull`, {
    headers: { Authorization: `Basic ${basicAuth}` },
    redirect: 'error',
  });
  if (!auth.ok) throw new Error(`Registry authentication failed (${auth.status})`);
  const credentials = await auth.json();
  if (typeof credentials.token !== 'string' || !credentials.token) throw new Error('Invalid registry authentication response');
  const response = await request(`https://ghcr.io/v2/${repository}/manifests/${tag}`, {
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      Accept: 'application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json',
    },
    redirect: 'error',
  });
  if (response.status === 404) {
    const body = await response.json();
    if (body.errors?.length === 1 && body.errors[0].code === 'MANIFEST_UNKNOWN') return null;
    throw new Error('Registry returned an unexpected missing-image response');
  }
  if (!response.ok) throw new Error(`Registry image lookup failed (${response.status})`);
  const digest = response.headers.get('docker-content-digest');
  if (!/^sha256:[0-9a-f]{64}$/.test(digest || '')) throw new Error('Registry image has no valid content digest');
  return digest;
}

async function planImage(github, context, tag, manifestChanges, request = globalThis.fetch) {
  const digest = await findImage(tag, context.actor, context.token, request);
  if (digest) return { build: false, digest };
  // Never synthesize a replacement for an already deployed or published version.
  if (!manifestChanges) throw new Error('Deployed image is missing; recover it explicitly');
  try {
    await github.rest.repos.getReleaseByTag({ ...context.repo, tag });
  } catch (error) {
    if (error.status === 404) return { build: true };
    throw error;
  }
  throw new Error('Published or draft Release has no image; recover it explicitly');
}

module.exports = { findImage, planImage };
