self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("lunch-menu-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/icon.png",
        "/og_image.png",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});