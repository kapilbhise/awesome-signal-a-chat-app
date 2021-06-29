import * as firebase from "firebase";

import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYGPPDPGZcAZB-BnFP2VOm2mUU6-kTuL4",
  authDomain: "awesome-signal.firebaseapp.com",
  projectId: "awesome-signal",
  storageBucket: "awesome-signal.appspot.com",
  messagingSenderId: "1068858625141",
  appId: "1:1068858625141:web:4006d106beb3a74f67bc3c",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
