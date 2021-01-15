"use strict";

// eslint-disable-next-line no-unused-vars
function __reload() {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister()
    }
  });
  caches.keys().then(keys => {
    caches.delete(keys.find(el => ~el.indexOf("workbox-precache")))
  });
  window.location.reload()
}

(function () {
  function processNode(node) {
    const tagName = (node.tagName || '').toLowerCase();
    if (tagName === 'script' || (tagName === 'link' && node.rel === 'stylesheet' && node.href)) {
      node.onerror = function (e) {
        console.error("failing to get assets.", e);
        if (!~e.target.src.indexOf(window.location.origin)) {
          return;
        }
        document.querySelector(".load_failed").style.display = "block";
        document.querySelector(".sk-chase").style.opacity = 0;
        document.querySelector(".load_title").style.opacity = 0
      }
    }
  }

  new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; ++i) {
      const mutation = mutations[i];
      const addedNodes = mutation.addedNodes;
      for (let j = 0; j < addedNodes.length; ++j) {
        processNode(addedNodes[j])
      }
    }
  }).observe(document.body, {
    childList: true,
    attributes: true,
    characterData: false,
  })
}());