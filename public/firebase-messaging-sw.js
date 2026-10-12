importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAYGHNs0N5WkhnnlbZANG9o8ZcN8xMmm0A",
    authDomain: "otc-flow.firebaseapp.com",
    projectId: "otc-flow",
    storageBucket: "otc-flow.firebasestorage.app",
    messagingSenderId: "626431412903",
    appId: "1:626431412903:web:8abf38fbc12cf92bd7a982",
    measurementId: "G-VXJJWVR377"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
