/* SKYPLANNING — Service Worker Firebase Cloud Messaging
   =======================================================
   Ce fichier DOIT être déployé à la racine du site, au même niveau que
   index.html (ex: https://votre-domaine/firebase-messaging-sw.js). Il est
   référencé par index.html via navigator.serviceWorker.register(...).
   Sans lui, l'enregistrement au push échoue silencieusement et aucune
   notification ne peut jamais arriver, même appli fermée.
*/
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Doit être IDENTIQUE au firebaseConfig utilisé dans index.html.
firebase.initializeApp({
  apiKey: "AIzaSyDyxBub9vexjpmAwlyuNgKd44t2fYqGeTw",
  authDomain: "skyplanning-26392.firebaseapp.com",
  projectId: "skyplanning-26392",
  storageBucket: "skyplanning-26392.firebasestorage.app",
  messagingSenderId: "507713371403",
  appId: "1:507713371403:web:d321e1e5aea4b94570f60e",
});

const messaging = firebase.messaging();

// Affiche la notification système quand un push FCM arrive alors que
// l'appli n'est PAS au premier plan (onglet fermé, téléphone verrouillé...).
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "SKYPLANNING";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  });
});

// Au clic sur la notification, ramène l'utilisateur sur l'appli (ou en ouvre
// un nouvel onglet si aucun n'est déjà ouvert).
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
