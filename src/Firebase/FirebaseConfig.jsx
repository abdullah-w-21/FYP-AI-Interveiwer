import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDI8zJPtwXyXmt1mxYOqbGBpmVthYMIEtg",
  authDomain: "iprepare-36293.firebaseapp.com",
  projectId: "iprepare-36293",
  storageBucket: "iprepare-36293.appspot.com",
  messagingSenderId: "886233027504",
  appId: "1:886233027504:web:046a228f962ddbadcf7c75"
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
