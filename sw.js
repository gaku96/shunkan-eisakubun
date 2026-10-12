const CACHE_NAME = "shunkan-eisakubun-v66";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=66",
  "./app.js?v=66",
  "./data.js?v=66",
  "./manifest.json",
  "./icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./audio/silence.mp3"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Only handle same-origin GET requests; bypass external APIs (Gemini, etc.) and non-GET requests
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) {
    return;
  }
  // Navigation request (opening or reloading the app): Network-First
  // This ensures iOS PWA always gets the freshest HTML when online,
  // while smoothly falling back to cache when offline.
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true }).then((cached) => cached || caches.match("./index.html", { ignoreSearch: true })))
    );
    return;
  }

  // Audio files: cache-first with dynamic caching and iOS Safari 206 Partial Content support
  if (e.request.url.includes("/audio/")) {
    e.respondWith(
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          const match = (await cache.match(e.request, { ignoreSearch: true })) || (await cache.match(e.request.url));

          if (!match) {
            try {
              const networkRes = await fetch(e.request);
              if (networkRes && networkRes.ok && networkRes.status === 200) {
                cache.put(e.request.url, networkRes.clone()).catch(() => {});
              }
              return networkRes;
            } catch (err) {
              return new Response("", { status: 404, statusText: "Not Found" });
            }
          }

          const rangeHeader = e.request.headers.get("range");
          if (!rangeHeader) {
            return match;
          }

          // Handle iOS Safari Range Request for cached Audio (AVPlayer requires 206 Partial Content)
          const arrayBuffer = await match.arrayBuffer();
          const byteLength = arrayBuffer.byteLength;
          const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
          if (rangeMatch) {
            let start = parseInt(rangeMatch[1], 10) || 0;
            let end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : byteLength - 1;
            if (end >= byteLength) end = byteLength - 1;
            if (start > end || start >= byteLength) {
              return new Response("", {
                status: 416,
                headers: { "Content-Range": `bytes */${byteLength}` }
              });
            }
            const chunk = arrayBuffer.slice(start, end + 1);

            return new Response(chunk, {
              status: 206,
              statusText: "Partial Content",
              headers: {
                "Content-Type": match.headers.get("Content-Type") || "audio/mp3",
                "Content-Range": `bytes ${start}-${end}/${byteLength}`,
                "Content-Length": String(chunk.byteLength),
                "Accept-Ranges": "bytes"
              }
            });
          }
          return match;
        } catch (err) {
          return fetch(e.request).catch(() => new Response("", { status: 404, statusText: "Not Found" }));
        }
      })()
    );
    return;
  }

  // Assets (CSS, JS, images): Stale-While-Revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => null);

      return cached || fetchPromise;
    })
  );
});
