---
layout: null
permalink: /sw.js
---
const C_VERSION = 3;
const CACHE = `offline-v${C_VERSION}`;
const OFFLINE_URL = "/offline.html";
self.addEventListener("install", (event) => {
  console.log("Installed");
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(["/files/css", "files/fonts", "/files/js", "/files/icons", "/files/images", "/files/svg", "/files/texts"]);
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
  self.skipWaiting();
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
  const { request } = event;
  if (request.headers.has('range')) return;
  console.log("Fetching...");
  event.respondWith(async function() {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) { return cachedResponse; }
    try {
      return await fetch(request);
    } catch (err) {
      if (request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
      console.log(`Fetch falied | ${err}`);
    }
  }());
});