---
permalink: /sw.js
---
{%- assign infiles = site.static_files | where: "sw-include", true -%}
const C_VERSION = "{{ site.github.build_revision | truncate: 8, '0' }}";
const CACHE = `fallback-v${C_VERSION}`;
const FALL_IMG = "/files/svg/emoji/1f47b.svg";
const FALL_URL = "/offline/index.html";
const OFFLINE_ARR = [
  {%- for file in infiles -%}
  {%- unless file == infiles.last -%}
    "{{ file.path }}",
  {%- else -%}
    "{{ file.path }}", FALL_URL
  {%- endunless -%}
  {%- endfor -%}
];
const deleteCache = async (key) => {
  await caches.delete(key);
};
const deleteOldCaches = async () => {
  const cacheKeepList = [CACHE];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};
function isImage(fetchRequest) {
  return fetchRequest.method === "GET" && fetchRequest.destination === "image";
}
self.addEventListener("install", (event) => {
  console.log("Installed");
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(OFFLINE_ARR);
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
      deleteOldCaches();
    })()
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.headers.has("range")) return;
  console.log(`Fetching | ${request.url}`);
  event.respondWith(async function() {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) { return cachedResponse; }
    try {
      return await fetch(request);
    } catch (err) {
      if (cachedResponse) { return cachedResponse; }
      if (request.mode === "navigate") {
        return caches.match(FALL_URL);
      }
      if (isImage(request)) {
        return caches.match(FALL_IMG);
      }
      console.warn(`Fetch falied | ${err}`);
    }
  }());
});