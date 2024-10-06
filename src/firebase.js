
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZjm3jYyWFIEKKA1I12IKLbFakczXDN50",
  authDomain: "olxclone-8fc68.firebaseapp.com",
  projectId: "olxclone-8fc68",
  storageBucket: "olxclone-8fc68.appspot.com",
  messagingSenderId: "723407935529",
  appId: "1:723407935529:web:898784be674e4d6be7a438",
  measurementId: "G-SP757H2JDM",
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase auth

// Export the necessary modules
export { auth, db };
