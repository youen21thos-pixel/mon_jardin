const CACHE_NAME = 'plantes-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(() => caches.match('/index.html'))
  );
});

// Notification push reçue du serveur (ou déclenchée localement)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: '🌿 Arrosage', body: 'Vérifie tes plantes aujourd\'hui !' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'arrosage-daily',
      requireInteraction: false,
      actions: [
        { action: 'open', title: 'Voir les plantes' },
        { action: 'dismiss', title: 'Ignorer' }
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action !== 'dismiss') {
    e.waitUntil(clients.openWindow('/'));
  }
});

// Alarme locale simulée via message
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        tag: 'arrosage-daily',
        requireInteraction: false,
        actions: [
          { action: 'open', title: 'Voir les plantes' }
        ]
      });
    }, delay);
  }
});
