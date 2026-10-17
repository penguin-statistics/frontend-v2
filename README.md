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
