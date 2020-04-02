/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.');

      window.SW_UPDATEFOUND = true;
      window.postMessage({
        from: "serviceWorker",
        action: "updatefound"
      }, "*");
    },
    updated (registration) {
      console.log('New content is available!');

      window.SW_UPDATED = true;
      window.postMessage({
        from: "serviceWorker",
        action: "updated"
      }, "*");

      window.addEventListener("message", evt => {
        if (evt && evt.data && evt.data.to === "serviceWorker" && evt.data.action === "skipWaiting") {
          registration.waiting.postMessage({
            action: "skipWaiting"
          })
        }
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  });

  let refreshing
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return
    window.location.reload()
    refreshing = true
  })
}
