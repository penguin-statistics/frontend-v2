// This allowlist documents one confirmed historical mismatch, not a wildcard bypass.
const legacy = {
  'v3.13.31': { sha: 'ee01c44eec7687ac760ee051ae69f1135c331c2c', version: '3.13.30' },
};
function checkVersion(tag, sha, version) {
  require('./release.cjs').validVersion(tag);
  if (tag === `v${version}`) return { legacy: false };
  const known = legacy[tag];
  if (known && known.sha === sha && known.version === version) return { legacy: true };
  throw new Error(`Release tag ${tag} does not match package version v${version}`);
}
if (require.main === module) {
  const result = checkVersion(process.env.GITHUB_REF_NAME, process.env.GITHUB_SHA, require('../../package.json').version);
  console.log(result.legacy ? 'Known historical tag/package mismatch; do not reuse this exception for new commits' : 'Release tag matches package version');
}
module.exports = { checkVersion };
