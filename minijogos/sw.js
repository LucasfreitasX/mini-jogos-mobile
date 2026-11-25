// Service worker do MiniJogos: deixa o site funcionar sem internet depois da primeira visita.
const CACHE = 'minijogos-v2';
const ARQUIVOS = [
  './',
  './index.html',
  './style.css',
  './txt.js',
  './pwa.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './adivinhe.html',
  './cruzadinha.html',
  './forca.html',
  './memoria.html',
  './pedra_papel_tesoura.html',
  './quiz.html',
  './snake.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

// Estratégia: tenta a rede; se falhar (sem internet), usa o que está salvo.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copia));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
