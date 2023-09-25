// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore,doc,setDoc} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAToilE0Qb9M7S4f3-RYNA0cUl8z8QRZ7U",
  authDomain: "default-page-4a8dc.firebaseapp.com",
  projectId: "default-page-4a8dc",
  storageBucket: "default-page-4a8dc.appspot.com",
  messagingSenderId: "754705571722",
  appId: "1:754705571722:web:233a2a0dff2aa99a28b273",
  measurementId: "G-JHSZ0XMERY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};