// Keep release recovery local to frontend-v2; never import this into shared @main actions.
const manifestPath = 'applications/frontend-rollout/values-prod.yaml';

function validVersion(tag) {
  if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) throw new Error('Expected a v-prefixed release version');
  return tag;
}

async function ensureRelease(github, context, tag) {
  validVersion(tag);
  const identity = { ...context.repo, tag };
  const existing = async () => {
    const release = await github.rest.repos.getReleaseByTag(identity);
    if (release.data?.draft) throw new Error('Existing Release is a draft; review before updating production manifests');
    return release;
  };
  try {
    return await existing();
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  try {
    return await github.rest.repos.createRelease({
      ...context.repo, tag_name: tag, name: tag,
      draft: false, prerelease: tag.includes('-'), generate_release_notes: true,
    });
  } catch (error) {
    // Another run may have created the release after our lookup. Only tolerate
    // that precise conflict, not authorization or unrelated validation errors.
    const exists = error.status === 422 && error.response?.data?.errors?.some(
      entry => entry.resource === 'Release' && entry.field === 'tag_name' && entry.code === 'already_exists'
    );
    if (!exists) throw error;
    return existing();
  }
}

function updateImageTag(source, tag) {
  validVersion(tag);
  // This deployment file is deliberately a tiny image.tag override. Fail closed
  // on any schema change instead of pretending to be a general YAML parser.
  const match = /^(image:[ \t]*\r?\n[ \t]+tag:[ \t]*)(v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)([ \t]*\r?\n?)$/.exec(source);
  if (!match) throw new Error('Unexpected frontend values override schema; review before updating');
  return { previous: match[2], changed: match[2] !== tag, content: match[1] + tag + match[3] };
}

async function ensureManifest(github, tag, sourceSha) {
  validVersion(tag);
  if (!/^[0-9a-f]{40}$/.test(sourceSha)) throw new Error('Expected full source commit SHA');
  const repository = { owner: 'penguin-statistics', repo: 'manifests' };
  const { data: repo } = await github.rest.repos.get(repository);
  const branch = repo.default_branch;
  const { data: file } = await github.rest.repos.getContent({ ...repository, path: manifestPath, ref: branch });
  if (Array.isArray(file) || file.type !== 'file' || file.encoding !== 'base64') throw new Error('Expected a base64 file');
  const update = updateImageTag(Buffer.from(file.content, 'base64').toString('utf8'), tag);
  if (!update.changed) return { changed: false };
  const previous = update.previous;
  // Historical reruns must not silently roll back a newer GitOps version.
  const stable = value => /^v(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number);
  const before = stable(previous), after = stable(tag);
  if (!before || !after) throw new Error('Manifest prerelease transitions require explicit review');
  for (let index = 0; index < 3; index++) {
    if (after[index] > before[index]) break;
    if (after[index] < before[index]) throw new Error('Refusing stale release rollback of the frontend manifest');
  }
  // The blob SHA is a compare-and-swap guard: concurrent edits fail for review.
  // Never retry by overwriting newly fetched production state automatically.
  await github.rest.repos.createOrUpdateFileContents({
    ...repository, path: manifestPath, branch, sha: file.sha,
    message: `${manifestPath}: update to ${tag} (${sourceSha.slice(0, 7)})`,
    content: Buffer.from(update.content).toString('base64'),
  });
  return { changed: true };
}

module.exports = { ensureRelease, ensureManifest, updateImageTag, validVersion };
