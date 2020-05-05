/* eslint-disable no-console */

import { Workbox } from "workbox-window";

let workbox;

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  workbox = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  workbox.register();

  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
} else {
  workbox = null;
}

export default workbox;
