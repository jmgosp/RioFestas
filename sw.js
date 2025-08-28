const CACHE_NAME = 'riofestas-v1.0.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/splash-screen.jpg',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Network-first para navegações/HTML para garantir atualização imediata
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(new Request(req, { cache: 'no-store' }))
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return response;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first para demais recursos
  event.respondWith(
    caches.match(req)
      .then((response) => {
        if (response) return response;
        return fetch(req)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, responseToCache));
            return networkResponse;
          })
          .catch(() => undefined);
      })
  );
});

// Recebe comando para ativar imediatamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificações push (para futuras implementações)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova festa disponível no RioFestas!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Festa',
        icon: 'https://placehold.co/96x96/ec4899/ffffff?text=🎉'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: 'https://placehold.co/96x96/666666/ffffff?text=✕'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('RioFestas', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
