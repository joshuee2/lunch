const CACHE_NAME = "homeworkout-cache-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "./og_image.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const requestUrl = new URL(event.request.url);
          const isSameOrigin = requestUrl.origin === self.location.origin;

          if (isSameOrigin && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }

          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
