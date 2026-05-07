import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEx1EIQqbHtd4KsAVTLZuHyssq3CgzXIM",
  authDomain: "strategylab1518.firebaseapp.com",
  projectId: "strategylab1518",
  storageBucket: "strategylab1518.firebasestorage.app",
  messagingSenderId: "108802383710",
  appId: "1:108802383710:web:4d05fce526ce2a94d279cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);