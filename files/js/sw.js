---
layout: null
permalink: /sw.js
---
const CACHE = "offline-fallback-v1";
const FALLBACK = `{%- include offline.html -%}`;
self.addEventListener("install", (event) => {
  console.log("Installed");
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(["/files/css", "/files/fonts", "/files/icons", "/files/images", "/files/svg", "/files/texts"]))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  console.log("Activated");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  console.log("Fetching...");
  event.respondWith(networkOrCache(event.request)
    .catch(() => useFallback()));
});
function networkOrCache(request) {
  return fetch(request)
    .then((response) => response.ok ? response : fromCache(request))
    .catch(() => fromCache(request));
}
function useFallback() {
  return Promise.resolve(new Response(FALLBACK, { headers: {
    "Content-Type": "text/html; charset=utf-8"
  }}));
}
function fromCache(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request).then((matching) =>
      matching || Promise.reject("no-match")
  ));
}
