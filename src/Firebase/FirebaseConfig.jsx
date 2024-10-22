import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  query,
  updateDoc,
  where,
  getDoc,
  orderBy,
  getDocs,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBC0AJbmgrEF39le-JTiZW991VrnI6lhWg",
    authDomain: "iprepare-dd7e4.firebaseapp.com",
    projectId: "iprepare-dd7e4",
    storageBucket: "iprepare-dd7e4.appspot.com",
    messagingSenderId: "648161338801",
    appId: "1:648161338801:web:9ff4669fa0ab4d4358c990"
  };

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  collection,
  addDoc,
  query,
  getDoc,
  updateDoc,
  orderBy,
  doc,
  getDocs,
  where,
  deleteDoc,
  serverTimestamp
};