import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBH5sEJGmKcn1obOB6OCLpg1HPhBjZkHR4',
  authDomain: 'loginsignuptest-45b6e.firebaseapp.com',
  projectId: 'loginsignuptest-45b6e',
  storageBucket: 'loginsignuptest-45b6e.firebasestorage.app',
  messagingSenderId: '692247186057',
  appId: '1:692247186057:web:2651b89bc03410dffb1458',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
