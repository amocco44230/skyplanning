/* ============================================================
   SKYPLANNING — Service Worker FCM (notifications en arrière-plan)
   Ce fichier doit être servi à la racine du site (même dossier que
   index.html), sous le nom exact "firebase-messaging-sw.js".
   ============================================================ */

// Passage immédiat en état actif, dès le tout début du fichier.
self.skipWaiting();
self.clients.claim();

// Sécurité supplémentaire : certains navigateurs n'honorent ces appels
// que s'ils sont faits depuis les événements du cycle de vie du SW.
// On les redéclare donc aussi ici, sans rien changer au comportement voulu.
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDyxBub9vexjpmAwlyuNgKd44t2fYqGeTw",
  authDomain: "skyplanning-26392.firebaseapp.com",
  projectId: "skyplanning-26392",
  storageBucket: "skyplanning-26392.firebasestorage.app",
  messagingSenderId: "507713371403",
  appId: "1:507713371403:web:d321e1e5aea4b94570f60e"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Notification reçue alors que l'app est fermée / en arrière-plan.
// IMPORTANT : on utilise self.registration.showNotification, jamais
// `new Notification(...)`, qui n'existe pas dans le contexte d'un Service Worker
// et qui échoue de toute façon sur le thread principal sous Chrome Android.
messaging.onBackgroundMessage((payload) => {
  const title =
    (payload.notification && payload.notification.title) ||
    (payload.data && payload.data.title) ||
    'SKYPLANNING';
  const options = {
    body:
      (payload.notification && payload.notification.body) ||
      (payload.data && payload.data.body) ||
      '',
    data: payload.data || {},
    tag: 'skyplanning-notification'
  };
  self.registration.showNotification(title, options);
});

// Clic sur la notification : ramène l'utilisateur sur l'application.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const existing = clientsArr.find((c) => 'focus' in c);
      if (existing) return existing.focus();
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
