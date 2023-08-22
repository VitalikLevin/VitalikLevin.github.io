---
layout: null
permalink: /sw.js
---
const C_VERSION = "1.0";
const CACHE = `offline-v${C_VERSION}`;
const OFFLINE_URL = "/offline/";
self.addEventListener("install", (event) => {
  console.log("Installed");
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(["/files/css", "/files/fonts", "/files/icons", "/files/images", "/files/svg", "/files/texts"]))
      .then(() => self.skipWaiting())
  );
  await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
});
self.addEventListener("activate", (event) => {
  console.log("Activated");
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  console.log("Fetching...");
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log("Failed to get data", error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});