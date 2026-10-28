const CACHE = 'whale-v8';
const FILES = ['./', './index.html', './manifest.json', './css/style.css', './js/core.js', './js/fx-layers.js', './js/audio.js', './js/shop.js', './js/settings.js', './js/gallery.js', './js/chat.js', './js/fish-list.js', './js/guide.js', './js/combat.js', './js/warriors-ui.js', './js/supports-ui.js', './js/monsters-ui.js', './js/settings-tabs.js', './js/input.js', './js/update.js', './js/render.js', './js/main.js', './crab.png', './sword.png', './horse.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Ưu tiên mạng (có bản mới thì lấy), mất mạng thì dùng cache. Font Montserrat cũng được lưu lại để dùng offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
