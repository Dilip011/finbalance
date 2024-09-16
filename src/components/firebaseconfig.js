
// import { initializeApp } from "firebase/app";
import {initializeApp} from "firebase/app";

//import {getFirestore, doc, getDoc } from "firebase/firestore";
import {getFirestore} from "firebase/firestore";

//import {getDatabase} from "firebase/database"
import {getDatabase} from "firebase/database";

//import {getAuth} from "firebase/auth"
import {getAuth} from "firebase/auth";





const firebaseConfig = {
  apiKey: "AIzaSyD2N0dzLsrUOtB5pB41F8o9lNz6X3cHtdM",
  authDomain: "balancesheet-a442d.firebaseapp.com",
  projectId: "balancesheet-a442d",
  storageBucket: "balancesheet-a442d.appspot.com",
  messagingSenderId: "762037367639",
  appId: "1:762037367639:web:2c061f1f672d2436be4412"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const database = getDatabase(app);
 const auth = getAuth(app)

export {app, db, database, auth}