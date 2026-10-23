<img src="https://penguin.upyun.galvincdn.com/logos/penguin_stats_logo.png"
     alt="Penguin Statistics - Logo"
     width="96px" />
     
# Penguin Statistics - Frontend
[![License](https://img.shields.io/github/license/penguin-statistics/frontend-v2)](https://github.com/penguin-statistics/frontend-v2/blob/dev/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/penguin-statistics/frontend-v2)](https://github.com/penguin-statistics/frontend-v2/commits/dev)
[![Docs](https://img.shields.io/badge/docs-GitBook-blue)](https://developer.penguin-stats.io)

This is the **frontend** project repository for the [Penguin Statistics](https://penguin-stats.io/?utm_source=github) website.

<img src="https://penguin.upyun.galvincdn.com/preview.jpg"
     alt="Penguin Statistics - Preview Screenshot"
     width="100%" />

## Maintainers
This frontend project has mainly being maintained by the following contributors (in alphabetical order):
- [AlvISsReimu](https://github.com/AlvISsReimu)
- [GalvinGao](https://github.com/GalvinGao)

> The full list of active contributors of the *Penguin Statistics* project can be found at the [Team Members page](https://penguin-stats.io/about/members) of the website.

## Configuration
### Environment Variables
- `NODE_ENV`: `development` or `production`
- `PENGUIN_PLATFORM`: `web` or `app`
- `PENGUIN_BUILDFROM`: `cf-pages`, `docker` or undefined
- `PENGUIN_STATIC_PUBLIC_PATH`: optional HTTPS static CDN prefix, used only for production web builds; defaults to `/`. Set this to the operator-confirmed Upyun **static asset** mirror URL (including the matching release directory), ending with `/`. It is not a website origin or an API base URL.
- `VUE_APP_DATADOG_RUM_APPLICATION_ID`, `VUE_APP_DATADOG_RUM_CLIENT_TOKEN`: optional [Datadog RUM](https://docs.datadoghq.com/real_user_monitoring/browser/) application (site `datadoghq.com`, service `penguin-stats-frontend`). RUM is only loaded, as a separate chunk after the page load, when both are set; builds without them (forks, local development) do not load it at all.
- `VUE_APP_DATADOG_RUM_SESSION_SAMPLE_RATE`: optional percentage of the sessions sent to RUM; defaults to `20`. The sessions left out do not download the SDK at all.
- `VUE_APP_DATADOG_RUM_ENV`: optional RUM `env`; defaults to `prod`.

The release image and mainland CDN envelope workflows pass the RUM settings from the repository (or organization) Actions variables `DATADOG_RUM_APPLICATION_ID`, `DATADOG_RUM_CLIENT_TOKEN` and `DATADOG_RUM_SESSION_SAMPLE_RATE` as Docker build arguments of the same `VUE_APP_` names. The client token is public by design: it ships in the bundle. Cloudflare Pages builds read them from the Pages project environment variables instead.

For a mainland edge deployment, build with `PENGUIN_BUILDFROM=docker` so API requests remain same-origin at `/PenguinStats/api/v2`. The edge must proxy that prefix to the backend. Example placeholders (replace the CDN URL):

```sh
PENGUIN_BUILDFROM=docker PENGUIN_STATIC_PUBLIC_PATH=https://cdn.example.com/releases/RELEASE/ yarn build:web
```

The Docker build also accepts `--build-arg PENGUIN_STATIC_PUBLIC_PATH=...`. Upload the matching `dist` assets under that exact CDN prefix before publishing its `index.html`; retain old releases for open clients. Serve `index.html` and `/service-worker.js` from the edge origin. The service worker intentionally stays same-origin. Verify JS/CSS, lazy chunks, fonts, image URLs, MIME types and CDN CORS for cross-origin fonts. This setting controls bundled asset URLs; the existing image CDN configuration in `src/config/index.js` is separate. Do not change the API base URL to the CDN.

No Upyun key belongs in this repository or the frontend bundle. Configure upload credentials through the existing secure CI secret store after the operator confirms whether the mirror hosts static build assets or an entire site. This change adds configuration support; no unconfirmed domain is enabled by default.

## How to contribute?
Our contribute guideline can be found at [Penguin Developers](https://developer.penguin-stats.io). PRs are always more than welcome!

## Supports
Thanks for the kindness support for this Open Source project from:
<li><a href="https://sentry.io"><img src="https://raw.githubusercontent.com/penguin-statistics/frontend-v2/master/docs/images/sentry.io.svg" height="50" /></a></li>
<li><a href="https://www.browserstack.com/"><img src="https://raw.githubusercontent.com/penguin-statistics/frontend-v2/master/docs/images/browserstack-logo.svg" height="50" /></a></li>
<li><a href="https://jetbrains.com/?from=penguin-statistics"><img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" height="50" /></a></li>
<li><a href="https://saucelabs.com"><img src="https://opensource.saucelabs.com/images/opensauce/powered-by-saucelabs-badge-red.png?sanitize=true" height="50" /></a></li>
<li><a href="https://simplelocalize.io"><img src="https://raw.githubusercontent.com/penguin-statistics/frontend-v2/master/docs/images/simplelocalize.io.png" height="50" /></a></li>


## Contributors

This project is made possible by the following contributors. Contributions are always welcome!

[![Contributors](https://contrib.rocks/image?repo=penguin-statistics/frontend-v2)](https://github.com/penguin-statistics/frontend-v2/graphs/contributors)

Validated on arm64 with Node 16.20.2 and Yarn 1.22.22: frozen lockfile install, production web build using the example CDN prefix, generated JS/CSS asset URLs and runtime prefix, unchanged API path, and same-origin service worker. Existing dependency/asset-size and Browserslist warnings remain; no dependency versions were changed.

### Mainland CDN envelope CI

`.github/workflows/cdn-envelope.yml` builds a separate mainland artifact on version-tag pushes (`v*` or mainland-only `cn-v*`). Use `cn-v<package-version>-<positive-sequence>` for mainland acceptance without invoking the existing global Docker/Sentry/GitOps release; for example, `cn-v3.13.30-1` must point to the exact reviewed source commit. Never move or reuse a tag. It does not deploy HTML, change manifests, or replace the existing Docker/Pages release paths. Pull requests run the same frozen Node 16.20.2 / Yarn 1.22.22 Docker builder with an invalid example CDN origin and run offline safety tests; they receive no upload credentials and produce no deployable package.

Configure these repository Actions settings before a tag release:

| Setting | Kind | Value |
| --- | --- | --- |
| `PENGUIN_STATIC_CDN_ORIGIN` | Variable | Confirmed bare HTTPS static CDN origin, e.g. `https://penguin.upyun.galvincdn.com` |
| `UPYUN_SERVICE` | Variable | Confirmed Upyun storage service/bucket name (not inferred from the CDN hostname) |
| `UPYUN_S3_ACCESS_KEY_ID` | Secret | Existing operator S3 AccessKey with read/write access to that service |
| `UPYUN_S3_SECRET_ACCESS_KEY` | Secret | Matching S3 SecretAccessKey from the Upyun console; no operator password required |

The CI is the sole writer of `/frontend-v2/releases/`; its global production concurrency group serializes all tag uploads. The locked official AWS SDK uses [Upyun S3 API](https://help.upyun.com/knowledge-base/s3-api/) over HTTPS at `https://s3.api.upyun.com`, with path-style requests and SigV4. `us-east-1` is the SDK signing placeholder; no region is configured in Upyun. S3 credentials come from the existing operator's S3 access-credentials view; neither an operator password nor a console password is used. The API does not supply a conditional write in this implementation: do not allow another workflow/operator to write the same release namespace concurrently. No object is deleted. Existing different bytes fail closed; a deterministic `release-lock.json` binds the complete asset and HTML manifests before uploading any missing resources. Identical reruns reuse stored bytes; partial runs resume. A changed rebuild of the same SHA fails instead of replacing an immutable release.

The order is: validate tag/package identity → build once with `PENGUIN_BUILDFROM=docker` and `https://<CDN>/frontend-v2/releases/<40-character-source-SHA>/` → validate HTML/runtime CDN references → check existing storage bytes → upload missing resources → public CDN GET every resource and check SHA-256, MIME and CORS → package the matching HTML envelope → upload the CI artifact. CDN must allow `https://penguin-stats.cn` (or `*`), including fonts. A reflected origin requires `Vary: Origin`. Redirects, transformed content, authentication errors and missing CORS fail the gate. CDN propagation failures can be retried by rerunning the workflow. Source maps are not published. Old prefixes must be retained for open clients and rollback.

The artifact `frontend-envelope-<SHA>-<run-attempt>` contains `frontend-envelope-<SHA>.tar.gz` and its external `.sha256`. The tar has exactly these regular files (no `./` prefix):

- `release.json`, `cdn-verification.json`, `SHA256SUMS`
- `site/index.html`, `site/service-worker.js`, `site/manifest.json`, `site/browserconfig.xml`, `site/robots.txt`, `site/favicon.ico`, `site/opensearch.xml`, `site/security.txt`, `site/llms.txt`
- `site/1000.html`, `site/50x.html`, `site/under-deploy.html`, `site/update-browser.html`
- `site/.well-known/security.txt`, `site/.well-known/apple-app-site-association`, `site/.well-known/api-catalog`, `site/.well-known/ai-catalog.json`
- `site/compliance/privacy-zh.html`, `site/compliance/eula-zh.html`
- `site/favicon/` files: `favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `apple-touch-icon.png`, `mstile-150x150.png`, `safari-pinned-tab.svg`

The `site/` files are those of the web build, but for penguin-stats.cn: `robots.txt` has no `Sitemap:` line (the mainland site has no sitemap) and names penguin-stats.cn, `llms.txt` is the Chinese `src/templates/mainland/llms.txt`, and `.well-known/mcp-registry-auth`, the MCP Registry's proof of penguin-stats.io, is left out (`IO_ONLY` and `MAINLAND` in `.github/scripts/cdn-envelope.cjs`).

`release.json` schema 1 binds `repository` (`penguin-statistics/frontend-v2`), `sourceSha`, `releaseTag`, `packageVersion`, `cdnPrefix`, `assetManifestSha256`, `siteManifestSha256`, `workflowRunId`, `workflowRunAttempt`. `cdn-verification.json` schema 1 contains `status: passed`, matching `sourceSha`, `cdnPrefix`, `assetManifestSha256`, plus `verifiedAt`, `verifiedAssetCount`, `corsOrigins`.

`SHA256SUMS` covers every `site/` file and both JSON files, not itself. Each line is `<lowercase-sha256><two spaces><archive path>\n`, UTF-8, LF including the final line, sorted by ASCII path. `siteManifestSha256` hashes the exact subset of those lines whose paths start with `site/`. `assetManifestSha256` uses the same format for CDN-relative asset paths. The verification marker is not a signature: obtain the external archive digest from trusted CI, verify both the archive and internal sums, and match the expected SHA/tag/prefix before deployment.

The infra document root is `/srv/penguin/current/site`. Serve HTML and the no-op `/service-worker.js` same-origin without long-lived caching, keep `/PenguinStats/api/v2` same-origin to the API gateway, and use SPA fallback for application routes. Missing static files should return 404. JS/CSS, lazy chunks, fonts and bundled images load directly from their absolute CDN URLs; do not proxy them through Aliyun. Only activate after successful CDN CI and deployment verification. The old full `dist/` output is not an envelope.
