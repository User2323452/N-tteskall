/* Minimal PWA service worker — cache shell for offline revisit */
const CACHE = "notteskall-shell-v6";
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/mark.png?v=6",
  "/icons/icon-192.png?v=6",
  "/icons/icon-512.png?v=6",
  "/icons/apple-touch-icon.png?v=6",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(
          SHELL.map(async (url) => {
            const response = await fetch(url, { cache: "reload" });
            if (!response.ok) throw new Error(url);
            await cache.put(url, response);
          })
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
