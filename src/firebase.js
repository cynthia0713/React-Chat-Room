import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAgoPyn85w6yEQPSYWsPmyW3x4LpRPXALg",
  authDomain: "react-chat-app-660f3.firebaseapp.com",
  projectId: "react-chat-app-660f3",
  storageBucket: "react-chat-app-660f3.appspot.com",
  messagingSenderId: "229291233699",
  appId: "1:229291233699:web:290d63e614d0926dee0a16"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };