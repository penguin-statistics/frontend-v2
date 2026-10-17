# Frontend release recovery, first stage

These changes are local to frontend-v2 and independent of the static-CDN PR. They do not change a shared action, create a release/tag, rerun a production workflow, update credentials or deploy by themselves. Do not merge until reviewed.

## What changes

- Use Node 16.20.2 consistently in `.node-version` and Docker; retain the existing lockfile and Yarn 1.22.22 package-manager declaration. Docker explicitly activates Yarn 1.22.22 with the bundled Corepack and installs with `--frozen-lockfile`. This stabilizes the known-working baseline; Node 16 is not the long-term target.
- Pin this repository's PR-check Docker action and shared metadata action to the inspected `e92ec679ecea64f9160208aa857caf8e0b70e56a` revision. Other repositories' `@main` references are untouched. The two changed workflows use immutable checkout v4 and github-script v7 commits; actionlint identified checkout v3 as an obsolete action runtime. This changes the runner action, not the application Node baseline. Container digests and transitive action pins remain a later reproducibility step.
- Check release tag against package.json before building/pushing or publishing. One exact historical exception documents `v3.13.31`, source `ee01c44eec7687ac760ee051ae69f1135c331c2c`, package `3.13.30`; a different source commit cannot use that exception. This PR does not bump package.json or alter any tag. Historical workflows retain their original definitions; this does not repair old runs retroactively.
- Keep the Sentry stage and existing secret names. Replace the shared release dispatcher only in this frontend workflow with local, mock-tested steps. GitHub Release creation reuses existing published releases without overwriting notes (draft releases require review); only a confirmed concurrent `tag_name/already_exists` conflict is recovered. Other API/auth errors still fail.
- Update only `applications/frontend-rollout/values-prod.yaml` in the manifests default branch through the GitHub Contents API using the existing `PAT_FOR_MANIFESTBOT` secret. Equal versions cause zero writes. A blob-SHA guard rejects concurrent edits rather than overwriting them. Older versions cannot roll back a newer stable version. Prerelease transitions and unexpected override YAML schemas fail closed for operator review. No automatic rollback is introduced.

The tiny manifest updater intentionally supports the current two-line `image.tag` override schema, not arbitrary YAML. A schema change requires a reviewed updater change. The old ManifestBot checkout/push action is no longer called by this frontend workflow; shared consumers continue using their current implementation. Contents API commits use the existing token identity rather than the old locally configured Git author.

## Known operational blockers

The original v3.13.31 failure was `Bad credentials` at ManifestBot checkout. The organization credential was updated after that failure; its current validity is not established by the old log. Any further credential verification must be handled separately and safely; this code does not repair credentials. No credential is requested, read, stored or printed by these changes. Do not test this by running a production release.

`manifests` is GitOps-managed with automatic synchronization: a future successful release workflow writing a different image version can deploy. This retains the existing production destination and requires the same operator-controlled tag/release process. The release job explicitly requests contents/packages write for its existing release/image duties; the manifests token remains separate. No new schedule, tag event, workflow_dispatch trigger or direct cluster access is added.

Public indexed code search found shared action references in frontend-v2, backend-next, widget-backend, roguestats-backend, roguestats-frontend, maintenance and gopkgserver (13 matching files including the actions repository). This is not proof about unindexed/private consumers, which is why the shared actions remain unchanged.

## Offline validation

```sh
node .github/tests/release.test.cjs
node .github/tests/release-image.test.cjs
```

The test suite uses mock GitHub clients only and never contacts GitHub or production manifests. It checks existing/missing/concurrently-created releases, nonrecoverable API errors, no-op manifests, guarded updates, conflicting edits, stale-version rejection and exact legacy-version handling. CI executes it before the Docker PR build and release side effects.

On M1, validate frozen dependency installation and `yarn build:web` with Node 16.20.2/Yarn 1.22.22. No package upgrade, lockfile refresh, Vue migration or CDN change belongs in this stage. Next stages: verify current release credential authorization, review controlled release recovery, improve image provenance/digests and core UI regression coverage, then migrate unsupported runtime/tooling in separately scoped PRs.

Validation recorded on M1: Node 16.20.2/Yarn 1.22.22 frozen install with lifecycle scripts enabled; production `PENGUIN_BUILDFROM=docker` web build; 11 offline mock checks; actionlint 1.7.12 on the two changed workflows; Node 16 bundled Corepack activation of Yarn 1.22.22; unchanged package.json/yarn.lock; clean whitespace checks. Existing peer dependency, Browserslist, lint and bundle-size warnings remain. The Docker engine is not installed on this M1, so the Linux image build must be verified by the PR's non-pushing Docker check. No production release or manifests write was executed for validation.

## Image recovery and promotion safety

The release workflow serializes all tags in the `frontend-production-release` concurrency group with cancellation disabled. GitHub does not guarantee queue order and may replace a pending run; every run therefore checks the current manifest before any release writes and reads it again with a blob-SHA guard for the final promotion. A stale version fails before image publication. A conflict at final promotion fails without retry.

An authenticated registry lookup reuses an existing version tag without building or pushing it. Only an explicit `404 MANIFEST_UNKNOWN` allows a new image, and only if that version is neither deployed nor associated with an existing GitHub Release (including drafts). Authentication, transport and unexpected responses fail closed. Missing images for already published/deployed versions require explicit recovery, not an automatic replacement. Existing version tags are treated as authoritative artifacts; this does not establish their provenance or repair external tag mutations.

New images receive only the exact version tag. This workflow never writes `latest`; it leaves any existing `latest` untouched. Production promotion continues through the guarded manifest version update. Consumers that require a moving `latest` need a separately reviewed promotion policy; do not restore automatic `latest` tagging on this recovery path.

Serialization covers runs using this workflow definition only, not historical workflow reruns, manual registry writers or other repositories. Do not run historical production definitions alongside this flow. GHCR tags have no compare-and-swap used here, so exclusive ownership of these version tags remains an operational requirement. The manifest retains its API-level blob guard against external concurrent edits.

Additional validation uses injected HTTP responses and in-memory manifest state only: image reuse, precise missing-image handling, fail-closed authentication/errors, missing published/deployed artifacts, old-tag reruns, both cross-tag promotion orders and workflow serialization/version-only publication wiring. No registry write or production run is used for testing.

Image recovery follow-up validated on M1 with Node 16.20.2 and Node 22.16.0: all 11 existing checks and 7 additional image recovery checks pass; actionlint 1.7.12 passes for both workflows; package.json, yarn.lock and Dockerfile are unchanged by the follow-up. No live registry authentication or publication was exercised.

## Pages Preview bootstrap

The observed Pages initializer installs Corepack 0.36.0 before the application command, which fails on Node 16 with `URL.canParse is not a function`. Pinning Yarn alone and setting SKIP_DEPENDENCY_INSTALL did not bypass that tool initialization. Preview therefore uses NODE_VERSION=22.22.2 only for platform bootstrap, YARN_VERSION=1.22.22 and SKIP_DEPENDENCY_INSTALL=1. `build/web.cjs` runs the actual frozen dependency install and unchanged web build via pinned npm-exec Node 16.20.2/Yarn 1.22.22, verifying both versions before installing. Normal local/Docker builds keep their original build command through build:web:base. Production Pages settings are not changed by this Preview fix.

The Pages retry confirmed the fixed Node 16/Yarn 1 frozen install succeeds. The legacy nested npx build then inherited the bootstrap npm configuration and failed before Vue compilation, so build:base now invokes the installed Vue CLI directly with Node and a 4096 MiB heap limit. It never resolves a build tool from the network.
