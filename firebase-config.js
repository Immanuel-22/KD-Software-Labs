// Firebase Configuration for KD Software Labs
const firebaseConfig = {
    apiKey: "AIzaSyAwcMDSU2BYSrtNgY2jFq_IGvqDu4XcC_Q",
    authDomain: "kd-software-labs.firebaseapp.com",
    projectId: "kd-software-labs",
    storageBucket: "kd-software-labs.firebasestorage.app",
    messagingSenderId: "768005828492",
    appId: "1:768005828492:web:5c07c720607e9ed702f0a9",
    measurementId: "G-J1LSHX3DL8"
};

// Check if Firebase is loaded (SDK loaded via CDN in HTML)
let isFirebaseActive = false;
let db = null;
let auth = null;

if (typeof firebase !== 'undefined') {
    if (firebaseConfig.projectId && firebaseConfig.projectId !== "kd-software-labs") {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            auth = firebase.auth();
            isFirebaseActive = true;
            console.log("🔥 Firebase initialized successfully. Active Mode: Cloud.");
        } catch (err) {
            console.error("❌ Failed to initialize Firebase:", err);
        }
    }
}





