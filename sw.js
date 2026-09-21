const CACHE_NAME = 'karate-v3';
const PRECACHE = ['./', './index.html', './manifest.json', './css/styles.css', './js/app.js', './js/audio.js', './js/data.js', './js/favorites.js', './js/install.js', './js/router.js', './js/search.js', './js/sw-register.js', './data/dachi.js', './data/geri.js', './data/kata.js', './data/kumite.js', './data/uke.js', './data/zuki.js', './assets/animations/blocks/age-uke.gif', './assets/animations/blocks/gedan-barai.gif', './assets/animations/blocks/gedan-juji-uke.gif', './assets/animations/blocks/shuto-uke.gif', './assets/animations/blocks/soto-uke.gif', './assets/animations/blocks/uchi-uke.gif', './assets/animations/kicks/fumikomi-geri.gif', './assets/animations/kicks/hiza-geri.gif', './assets/animations/kicks/kakato-geri.gif', './assets/animations/kicks/mae-geri.gif', './assets/animations/kicks/mawashi-geri.gif', './assets/animations/kicks/mawashi-geri.jpg', './assets/animations/kicks/mikasuki-geri.gif', './assets/animations/kicks/roundhouse-kick.gif', './assets/animations/kicks/tobi-geri.gif', './assets/animations/kicks/ura-mawashi-geri.gif', './assets/animations/kicks/ushiro-geri-alt.gif', './assets/animations/kicks/ushiro-geri.gif', './assets/animations/kicks/yoko-geri-kekomi.gif', './assets/animations/kicks/yoko-geri-kekomi.jpg', './assets/animations/punches/gyaku-zuki.jpg', './assets/animations/punches/jodan-zuki.gif', './assets/animations/punches/kizami-zuki.gif', './assets/animations/punches/oi-zuki.gif', './assets/animations/punches/ura-zuki.gif', './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/images/stances/kiba-dachi.jpg', './assets/images/stances/kokutsu-dachi.jpg', './assets/images/stances/neko-ashi-dachi.png', './assets/images/stances/zenkutsu-dachi.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      return new Response('', {status: 503, statusText: 'Offline'});
    });
  }));
});
