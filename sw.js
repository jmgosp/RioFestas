const CACHE_NAME = 'riofestas-v1.1.0';
const IMAGE_CACHE_NAME = 'riofestas-images-v1.1.0';
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

// Configurações de cache para imagens
const IMAGE_CACHE_CONFIG = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  maxSize: 50 * 1024 * 1024, // 50MB
  maxEntries: 200
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Cache principal aberto');
        return cache.addAll(urlsToCache);
      }),
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        console.log('Cache de imagens aberto');
        return cache;
      })
    ])
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Limpar cache de imagens antigas
      return cleanupImageCache();
    })
  );
});

// Limpeza do cache de imagens
async function cleanupImageCache() {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const keys = await cache.keys();
    const now = Date.now();
    
    // Remover imagens expiradas
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const age = now - new Date(dateHeader).getTime();
          if (age > IMAGE_CACHE_CONFIG.maxAge) {
            await cache.delete(request);
          }
        }
      }
    }
    
    // Se ainda houver muitas imagens, remover as mais antigas
    const remainingKeys = await cache.keys();
    if (remainingKeys.length > IMAGE_CACHE_CONFIG.maxEntries) {
      const sortedKeys = remainingKeys.sort((a, b) => {
        return a.url.localeCompare(b.url);
      });
      
      const toDelete = sortedKeys.slice(0, remainingKeys.length - IMAGE_CACHE_CONFIG.maxEntries);
      for (const key of toDelete) {
        await cache.delete(key);
      }
    }
  } catch (error) {
    console.warn('Erro ao limpar cache de imagens:', error);
  }
}

// Estratégia de cache para imagens
async function cacheImageStrategy(request) {
  try {
    // Verificar cache primeiro
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Buscar da rede
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clonar resposta para cache
      const responseToCache = networkResponse.clone();
      
      // Adicionar ao cache de imagens
      cache.put(request, responseToCache);
      
      // Limpar cache se necessário
      setTimeout(cleanupImageCache, 1000);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Erro ao carregar imagem:', error);
    
    // Retornar fallback se disponível
    const fallbackUrl = getFallbackImageUrl(request.url);
    if (fallbackUrl) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    throw error;
  }
}

// Gerar URL de fallback baseado no contexto
function getFallbackImageUrl(originalUrl) {
  if (originalUrl.includes('avatar') || originalUrl.includes('user')) {
    return 'https://placehold.co/128x128/f472b6/ffffff?text=U';
  } else if (originalUrl.includes('event') || originalUrl.includes('party')) {
    return 'https://placehold.co/280x176/f9a8d4/ffffff?text=Evento';
  }
  return 'https://placehold.co/280x176/f9a8d4/ffffff?text=RioFestas';
}

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Estratégia específica para imagens
  if (request.destination === 'image') {
    event.respondWith(cacheImageStrategy(request));
    return;
  }
  
  // Estratégia para outros recursos
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Retorna do cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver no cache, busca da rede
        return fetch(request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para poder usar no cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas offline
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
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

// Mensagem para comunicação com a aplicação
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_IMAGE_CACHE') {
    event.waitUntil(cleanupImageCache());
  }
});
