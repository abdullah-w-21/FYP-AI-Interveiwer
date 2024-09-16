import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_-vGdwbyjBEUQYngGYSSHJ_6CTsVH9oQ",
  authDomain: "iprepare-2ee99.firebaseapp.com",
  projectId: "iprepare-2ee99",
  storageBucket: "iprepare-2ee99.appspot.com",
  messagingSenderId: "366359177472",
  appId: "1:366359177472:web:1f89fc1a7180a46ec46be5"
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
