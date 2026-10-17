# Frontend release recovery, first stage

These changes are local to frontend-v2 and independent of the static-CDN PR. They do not change a shared action, create a release/tag, rerun a production workflow, update credentials or deploy by themselves. Do not merge until reviewed.

## What changes

- Use Node 16.20.2 consistently in `.node-version` and Docker; retain the existing lockfile and Yarn 1.22.22 package-manager declaration. Docker explicitly activates Yarn 1.22.22 with the bundled Corepack and installs with `--frozen-lockfile`. This stabilizes the known-working baseline; Node 16 is not the long-term target.
- Pin this repository's shared Docker/metadata actions to the inspected `e92ec679ecea64f9160208aa857caf8e0b70e56a` revision. Other repositories' `@main` references are untouched. The two changed workflows use immutable checkout v4 and github-script v7 commits; actionlint identified checkout v3 as an obsolete action runtime. This changes the runner action, not the application Node baseline. Container digests and transitive action pins remain a later reproducibility step.
- Check release tag against package.json before building/pushing or publishing. One exact historical exception documents `v3.13.31`, source `ee01c44eec7687ac760ee051ae69f1135c331c2c`, package `3.13.30`; a different source commit cannot use that exception. This PR does not bump package.json or alter any tag. Historical workflows retain their original definitions; this does not repair old runs retroactively.
- Keep the Sentry stage and existing secret names. Replace the shared release dispatcher only in this frontend workflow with local, mock-tested steps. GitHub Release creation reuses existing published releases without overwriting notes (draft releases require review); only a confirmed concurrent `tag_name/already_exists` conflict is recovered. Other API/auth errors still fail.
- Update only `applications/frontend-rollout/values-prod.yaml` in the manifests default branch through the GitHub Contents API using the existing `PAT_FOR_MANIFESTBOT` secret. Equal versions cause zero writes. A blob-SHA guard rejects concurrent edits rather than overwriting them. Older versions cannot roll back a newer stable version. Prerelease transitions and unexpected override YAML schemas fail closed for operator review. No automatic rollback is introduced.

The tiny manifest updater intentionally supports the current two-line `image.tag` override schema, not arbitrary YAML. A schema change requires a reviewed updater change. The old ManifestBot checkout/push action is no longer called by this frontend workflow; shared consumers continue using their current implementation. Contents API commits use the existing token identity rather than the old locally configured Git author.

## Known operational blockers

The original v3.13.31 failure was `Bad credentials` at ManifestBot checkout. The owner must safely repair/authorize the existing credential separately; this code cannot repair it. No credential is requested, read, stored or printed by these changes. Do not test this by running a production release.

`manifests` is GitOps-managed with automatic synchronization: a future successful release workflow writing a different image version can deploy. This retains the existing production destination and requires the same operator-controlled tag/release process. The release job explicitly requests contents/packages write for its existing release/image duties; the manifests token remains separate. No new schedule, tag event, workflow_dispatch trigger or direct cluster access is added.

Public indexed code search found shared action references in frontend-v2, backend-next, widget-backend, roguestats-backend, roguestats-frontend, maintenance and gopkgserver (13 matching files including the actions repository). This is not proof about unindexed/private consumers, which is why the shared actions remain unchanged.

## Offline validation

```sh
node .github/tests/release.test.cjs
```

The test suite uses mock GitHub clients only and never contacts GitHub or production manifests. It checks existing/missing/concurrently-created releases, nonrecoverable API errors, no-op manifests, guarded updates, conflicting edits, stale-version rejection and exact legacy-version handling. CI executes it before the Docker PR build and release side effects.

On M1, validate frozen dependency installation and `yarn build:web` with Node 16.20.2/Yarn 1.22.22. No package upgrade, lockfile refresh, Vue migration or CDN change belongs in this stage. Next stages: restore trusted release credentials, review controlled release recovery, improve image provenance/digests and core UI regression coverage, then migrate unsupported runtime/tooling in separately scoped PRs.

Validation recorded on M1: Node 16.20.2/Yarn 1.22.22 frozen install with lifecycle scripts enabled; production `PENGUIN_BUILDFROM=docker` web build; 11 offline mock checks; actionlint 1.7.12 on the two changed workflows; Node 16 bundled Corepack activation of Yarn 1.22.22; unchanged package.json/yarn.lock; clean whitespace checks. Existing peer dependency, Browserslist, lint and bundle-size warnings remain. The Docker engine is not installed on this M1, so the Linux image build must be verified by the PR's non-pushing Docker check. No production release or manifests write was executed for validation.
