// --- Firebase Configuration & Initialization ---

// NOTE: You must replace the placeholders below with your actual Firebase project configuration.
const firebaseConfig = {
     apiKey: "AIzaSyDbZnuGZuYjLC9NKI457ghe3iPGRI9QMBU",
     authDomain: "my-asset-tracker-f628d.firebaseapp.com",
     projectId: "my-asset-tracker-f628d",
     storageBucket: "my-asset-tracker-f628d.firebasestorage.app",
     messagingSenderId: "977229082323",
     appId: "1:977229082323:web:546bcd7624fec2435aae26",
     measurementId: "G-K62121KCZ2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// --- Global User State ---
let currentUser = null; // Will be set by auth.onAuthStateChanged
let userDocRef = null; // Reference to the user's data document in Firestore

// Auth State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        userDocRef = db.collection('users').doc(user.uid);
        console.log('User signed in:', user.uid);
        // This function will trigger the main data loading process
        loadUserData();
    } else {
        currentUser = null;
        userDocRef = null;
        console.log('User signed out. Showing sign-in screen.');
        // Optionally show a sign-in screen or handle sign-out view
    }
});