/* eslint-env serviceworker */

self.addEventListener('install', () => {
  skipWaiting();
});

self.addEventListener('activate', () => {
  caches.has("workbox-precache-v2").then(has => {
    if (has) {
      caches.keys().then(keys => {
        keys.forEach(key => {
          caches.delete(key)
        })
      })
    }
  })
})

// intentially left blank
// because there's no handlers anymore, the service-worker is just an empty service worker now.
