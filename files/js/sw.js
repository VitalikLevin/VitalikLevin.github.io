self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('networms-cache').then(cache => {
      return cache.addAll([
        '/index.html',
        '/files/icons/favicon.svg',
        '/files/css/fonts.css',
        '/files/css/style.css',
        '/files/css/light.css',
        '/files/css/dark.css'
      ]);
    })
  );
});