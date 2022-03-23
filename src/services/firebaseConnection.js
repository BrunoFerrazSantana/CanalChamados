import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyCOHA834UWuxoVOpmOqr8W0XakuDiNNl9M",
    authDomain: "chamados-be036.firebaseapp.com",
    projectId: "chamados-be036",
    storageBucket: "chamados-be036.appspot.com",
    messagingSenderId: "1067133700254",
    appId: "1:1067133700254:web:14f49a05c043038a6b538f",
    measurementId: "G-Q6Y8PYL7J1"
  };

if(!firebase.apps.length){  
    firebase.initializeApp(firebaseConfig);
}

export default firebase;