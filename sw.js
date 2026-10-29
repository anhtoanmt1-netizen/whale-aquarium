const CACHE = 'whale-v9';
const FILES = ['./', './index.html', './manifest.json', './crab.png', './sword.png', './horse.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  // một file lỗi không làm hỏng cả service worker
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(new Request(f, {cache: 'reload'})).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Luôn lấy bản mới nhất từ mạng (bỏ qua bộ nhớ đệm trình duyệt); mất mạng mới dùng bản đã lưu
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const same = new URL(e.request.url).origin === self.location.origin;
  e.respondWith(
    (same ? fetch(e.request.url, {cache: 'no-cache', credentials: 'same-origin'}) : fetch(e.request)).then(r => {
      if (r && r.ok && same) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
