/* eslint-disable no-console */

import { Workbox } from "workbox-window";

let workbox;

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  workbox = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  workbox.addEventListener("controlling", () => {
    window.location.reload();
  });

  workbox.register();
} else {
  workbox = null;
}

export default workbox;
