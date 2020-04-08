/* eslint-disable no-console */

import { Workbox } from "workbox-window";

let workbox;

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  workbox = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  workbox.addEventListener("controlling", () => {
    window.location.reload();
  });

  workbox.addEventListener("waiting", event => {
    console.log(event)
    if (event.wasWaitingBeforeRegister) {
      workbox.messageSW({ type: "SKIP_WAITING" });
    }
  });

  workbox.register();
} else {
  workbox = null;
}

export default workbox;
