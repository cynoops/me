const CACHE_NAME = "me-offline-cache-v2";
const OFFLINE_ASSETS = ["/", "/index.html", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Always let the browser fetch the latest worker script so updates are not
  // served from our runtime cache. Otherwise `navigator.serviceWorker.update()`
  // could keep seeing a stale cached copy and never pick up new releases.
  if (new URL(event.request.url).pathname === "/service-worker.js") {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(event.request);

        if (
          response &&
          response.status === 200 &&
          response.type === "basic" &&
          !event.request.url.startsWith("chrome-extension://")
        ) {
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          const offlineShell = await cache.match("/index.html");
          if (offlineShell) return offlineShell;
        }

        throw error;
      }
    })(),
  );
});
