import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyAbPN3BKFr8o1IdaEU2csdRsh9EfxHB1Gs",
    authDomain: "aplicacaodefilme.firebaseapp.com",
    projectId: "aplicacaodefilme",
    storageBucket: "aplicacaodefilme.firebasestorage.app",
    messagingSenderId: "922246627027",
    appId: "1:922246627027:web:d5dc05768055a702e11e26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);