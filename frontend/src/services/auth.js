// auth.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {    apiKey: "AIzaSyDVJc6wXMxuMvfEbltClCZzia5FTsVJghs",
                            authDomain: "task-manager-d8dc1.firebaseapp.com",
                            projectId: "task-manager-d8dc1",
                            storageBucket: "task-manager-d8dc1.firebasestorage.app",
                            messagingSenderId: "979329715145",
                            appId: "1:979329715145:web:1376220d6d89358ac13618"
 };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider Instances
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign-in Functions
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithGithub = () => signInWithPopup(auth, githubProvider);
export const loginWithEmail = (email, pass) => signInWithEmailAndPassword(auth, email, pass);