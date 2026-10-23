# AGENTS.md

Guidance for coding agents (and people) changing this repository. Keep it short and true: if you change a command,
a path or a rule below, update this file in the same PR.

frontend-v2 is the Penguin Statistics website (https://penguin-stats.io): a Vue 2 single-page app (Vue CLI 4,
Vuetify 2, Vuex 3, vue-router 3 in history mode, vue-i18n 8, Highcharts), also packaged as iOS and Android apps with
Capacitor. Its API is backend-next, same-origin under `/PenguinStats/api/v2`.

Only want to use the data? See https://developer.penguin-stats.io/public-api; the data is CC BY-NC 4.0.

## Setup and commands

- Node 16.20.2 (`.node-version`, the Dockerfile) and Yarn 1.22.22 (`packageManager` in `package.json`). Upgrades of
  Node, Vue, Vuetify or the lockfile go in their own PRs, never as a side effect of another change.
- `yarn install --frozen-lockfile`
- `yarn serve:web`: dev server. It proxies `/PenguinStats` to the production API (`vue.config.js`).
- `yarn build:web`: production web build in `dist/`. The image builds with `PENGUIN_BUILDFROM=docker`; the README
  lists the other environment variables.
- `yarn lint --no-fix`: ESLint through Vue CLI. Plain `yarn lint` also rewrites what it can fix. `master` has
  warnings but no errors; add neither.
- `node .github/tests/<name>.test.cjs`: tests of the CI scripts. "Build Docker Image (Check)" runs `release`,
  `release-image` and `pages-build`; "Mainland CDN envelope" runs `cdn-envelope` and `cdn-s3` (after
  `npm ci --prefix .github/s3 --ignore-scripts`). CI runs them with the runner's Node, not 16; `cdn-s3` fails on 16.

## Layout

| Path | What |
|---|---|
| `src/router.js` | Routes. The stats pages are `/:lang/result/:server/...` (`zh`, `en`, `ja`, `ko`; `cn`, `us`, `jp`, `kr`) |
| `src/views`, `src/components`, `src/layouts` | Pages and components |
| `src/apis`, `src/store/modules`, `src/utils/service.js` | API calls, the Vuex store and its cached data, the axios instance |
| `src/locales/*.json`, `src/i18n.js` | Translations (see Rules) |
| `src/templates/web`, `src/templates/app` | Each platform's `index.html`, and static files copied into the build root (`.well-known/`, `compliance/`, ...) |
| `public/` | More static files for the build root (`robots.txt`, `manifest.json`, `service-worker.js`, ...) |
| `build/` | Web build script, CDN prefix, the image's nginx config (`nginx-default.conf`) |
| `.github/` | Workflows (PR image check, release, mainland CDN envelope), their scripts and tests |
| `android/`, `ios/` | Capacitor apps |

## Rules

- **URLs are shared with backend-next**, which renders the same `/{lang}/result/{server}/...` pages for crawlers and
  lists them in its sitemaps. Change those routes only together with backend-next.
- **New files in the build root**: every file of `dist/` outside `js/`, `css/`, `fonts/` and `img/` must be listed
  in `SITE` in `.github/scripts/cdn-envelope.cjs`, or the "Mainland CDN envelope" check fails, on PRs too
  (`Unclassified build output: <path>`).
- **i18n**: strings are in `src/locales/{zh_CN,en_US,ja_JP,ko_KR}.json`, plus `*_x_seaborn.json` for a theme;
  missing keys fall back to English. `src/locales/README.md` says these files come from SimpleLocalize, but its
  daily download (`.github/workflows/simplelocalize.yml`) is disabled, and maintainers edit them here.
- **API base**: keep the API same-origin (`/PenguinStats/api/v2`, `src/utils/service.js`). `PENGUIN_STATIC_PUBLIC_PATH`
  is a CDN prefix for the bundled assets only.
- **Drop rates** are `quantity / times` and can exceed 100%; the stats tables show them with the sample size
  (`times`) and the time window.
- **Reports**: the report and recognition flows submit player data. Do not add ways to submit drops that did not
  come from a real game result, and do not submit test reports: the dev server sends them to production.
- No secrets, internal host names or IP addresses in code, comments, commit messages or PRs. Public client
  identifiers ship in the bundle by design: the Datadog RUM client token (README), the Sentry DSN
  (`src/injections/sentry.js`) and the Google Analytics IDs (`src/injections/googleAnalytics.js`). No secret belongs
  in this repository or the bundle.

## Pull requests

- Branch from `master`, open the PR against `master`; PRs are squash-merged.
- Conventional commit titles (`.github/COMMIT_CONVENTION.md`): `feat(rum): ...`, `fix(seo): ...`, `chore: ...`. A
  stack of PRs prefixes `[topic n/m] `.
- Releases are maintainers' work: a PR titled `Release vX.Y.Z` bumps `version` in `package.json`. When it merges,
  the Release Dispatcher tags it, `build-release.yml` builds the image and promotes it in the manifests repository
  (`applications/frontend-rollout/values-prod.yaml`), and `cdn-envelope.yml` builds the mainland artifact. After a
  release, check that every JS and CSS file of the live page loads with the right `Content-Type`.
