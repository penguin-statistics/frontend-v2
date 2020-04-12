/* eslint-env serviceworker */

import { registerRoute } from 'workbox-routing';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    skipWaiting();
  }
});

cleanupOutdatedCaches();

// === Google Fonts ===

registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// === CDN Resources ===

// fancy backgrounds
registerRoute(
  /^https:\/\/penguin\.upyun\.galvincdn\.com\/backgrounds\//,
  new CacheFirst({
    cacheName: "penguin-backgrounds",
    plugins: [
      new ExpirationPlugin({
        // maxEntries: 30,
        purgeOnQuotaError: true
      })
    ]
  })
)

// other images
registerRoute(
  /^https:\/\/penguin\.upyun\.galvincdn\.com\/(logos|avatars)\//,
  new CacheFirst({
    cacheName: "penguin-images"
  })
)

// === Site Resources ===

// // files that are versioned. safe to cache.
// registerRoute(
//   /.[a-f0-9]{8}.(css|js|woff2|ttf|woff|eof|svg|png)/,
//   new CacheFirst({
//     cacheName: "penguin-site-resources"
//   })
// )

// if the network failed, use the cache instead; otherwise use the
// fresh data coming from the api
registerRoute(
  /^https:\/\/penguin-stats\.io\/PenguinStats\//,
  new NetworkFirst({
    cacheName: "penguin-api-responses",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        maxEntries: 10
      }),
    ]
  })
)

// precache the item sprite file
// registerRoute(
//   "https://penguin.upyun.galvincdn.com/item_sprite.png",
//   new StaleWhileRevalidate({
//     cacheName: "penguin-sprite",
//     plugins: [
//       new ExpirationPlugin({
//         maxAgeSeconds: 60 * 60 * 24,
//         maxEntries: 3
//       }),
//     ]
//   })
// )

// eslint-disable-next-line no-unused-vars
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest)
