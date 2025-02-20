import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyARvbDLfzDhg0IyAvmzB4JS0YnROBUZIwY",
  authDomain: "rmaudience-4caaa.firebaseapp.com",
  projectId: "rmaudience-4caaa",
  storageBucket: "rmaudience-4caaa.firebasestorage.app",
  messagingSenderId: "202958853872",
  appId: "1:202958853872:web:bc366c74d6af9ab0711435",
  measurementId: "G-61W1ETLN0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
