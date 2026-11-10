// Guarda só a casca do app para abrir sem rede; os dados vêm sempre do gist (o último fica no localStorage).
const CASCA = "uso-ias-v2";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => e.waitUntil(caches.open(CASCA).then(c => c.addAll(ARQUIVOS))));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CASCA).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => {
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copia = r.clone();
    caches.open(CASCA).then(c => c.put(e.request, copia));
    return r;
  }).catch(() => caches.match(e.request)));
});
