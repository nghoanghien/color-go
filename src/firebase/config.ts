import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAFBzUPTubSxhNeVvyeTwEZp9phyjFuYgU",
  authDomain: "color-go-50e92.firebaseapp.com",
  projectId: "color-go-50e92",
  storageBucket: "color-go-50e92.firebasestorage.app",
  messagingSenderId: "402235694376",
  appId: "1:402235694376:web:036124cb2a492055a8041d"
};

const app = initializeApp(firebaseConfig);

export default app;