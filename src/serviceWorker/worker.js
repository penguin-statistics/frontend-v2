self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page.
self.addEventListener("message", msg => {
  if (msg && msg.data && msg.data.action === "skipWaiting"){
    console.info("[ServiceWorker] skipping waiting.")
    self.skipWaiting()
      .then(() => {
        console.info("[ServiceWorker] successfully skipped waiting.")
      })
      .catch((err) => {
        console.error("[ServiceWorker] failed to skip waiting:", err)
      });
    console.debug("[ServiceWorker] queried skipWaiting().")
  }
});
