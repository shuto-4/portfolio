// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-HQ6LqNY7PaxLrk-7WFa8pCV-iZ5K7Y4",
  authDomain: "portfolio-ccbf4.firebaseapp.com",
  projectId: "portfolio-ccbf4",
  storageBucket: "portfolio-ccbf4.firebasestorage.app",
  messagingSenderId: "814637723309",
  appId: "1:814637723309:web:3a204d26c7726ac6722024",
  measurementId: "G-0FWMG0R6N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app; 