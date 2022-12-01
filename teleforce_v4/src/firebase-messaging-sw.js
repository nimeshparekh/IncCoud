importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
    messagingSenderId: "242062901427",
    apiKey: "AIzaSyB5sad2Z_4k2sceJ2VOrIpbctP5t8fsX3w",
    authDomain: "televoice-e6dc2.firebaseapp.com",
    projectId: "televoice-e6dc2",
    storageBucket: "televoice-e6dc2.appspot.com",
    appId: "1:242062901427:web:73d284bc0291ae80a670c6",
    measurementId: "G-Y4RSRDWTQ5"
});
const messaging = firebase.messaging();