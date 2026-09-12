import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdV-jQYjjD_13zQpwYBZ-5GkZDWilyZzM",
  authDomain: "biyonum-policeum.firebaseapp.com",
  projectId: "biyonum-policeum",
  storageBucket: "biyonum-policeum.firebasestorage.app",
  messagingSenderId: "1071464628318",
  appId: "1:1071464628318:web:80eb3b135a12333628f4cf"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);