import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAkJqJKR7rNUCVww-G0J2zF7Zno9yTN7HU",
    authDomain: "quailcageiot.firebaseapp.com",
    databaseURL: "https://quailcageiot-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quailcageiot",
    storageBucket: "quailcageiot.firebasestorage.app",
    messagingSenderId: "697234132399",
    appId: "1:697234132399:web:1ba1716596acb1b48f735a",
    measurementId: "G-17KRWC3WK2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
