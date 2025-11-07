import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBfeGok3BekmDKMApuqgFw3jOTZqlPZ4k",
  authDomain: "akeno-tech-blog.firebaseapp.com",
  projectId: "akeno-tech-blog",
  storageBucket: "akeno-tech-blog.firebasestorage.app",
  messagingSenderId: "971660241179",
  appId: "1:971660241179:web:d89bf456de20efd02bcbbe",
  measurementId: "G-04GNCJD3XZ"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };

export default app;
