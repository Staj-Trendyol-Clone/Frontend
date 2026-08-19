// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence /*tsconfig'de bunun hatasının çözümü var*/  } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu1YGN5naekxLbaWXtlJprgOaBXppN6r0",
  authDomain: "stajtodoapp-58d2d.firebaseapp.com",
  projectId: "stajtodoapp-58d2d",
  storageBucket: "stajtodoapp-58d2d.firebasestorage.app",
  messagingSenderId: "730458413178",
  appId: "1:730458413178:web:8ff7d8bd830722017bc3c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
