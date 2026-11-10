// NEPO Security · funcionamiento sin conexión (guarda la app y sus librerías)
const C = "nepo-v3";
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "logo.jpg", "manifest.json", "icons/icon-192.png", "icons/icon-512.png"]).catch(() => {}))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || !(u.origin === location.origin || u.hostname === "www.gstatic.com" || u.hostname === "cdnjs.cloudflare.com")) return;
  const page = r.mode === "navigate" || u.pathname.endsWith("index.html");
  e.respondWith(page
    ? fetch(r).then(x => { const y = x.clone(); caches.open(C).then(c => c.put(r, y)); return x; }).catch(() => caches.match(r).then(m => m || caches.match("index.html") || caches.match("./")))
    : caches.match(r).then(m => m || fetch(r).then(x => { if (x.ok) { const y = x.clone(); caches.open(C).then(c => c.put(r, y)); } return x; })));
});
